"use client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {flexRender, getCoreRowModel, getFilteredRowModel, useReactTable} from "@tanstack/react-table";
import clsx from "clsx";
import _ from "lodash"
import {
    CodeIcon,
    FileArchive,
    FileArchiveIcon,
    LucideMessageCircleQuestion,
    Settings,
    SettingsIcon,
    UserIcon
} from "lucide-react"

type Task = {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedTo: string;
    createdDate: string;
    tags?: string[];
}

export const data: Task[] = [
    {
        "id": "1",
        "name": "Finish report",
        "description": "Complete the quarterly financial report.",
        "dueDate": "2024-11-30",
        "priority": "High",
        "status": "In Progress",
        "assignedTo": "Alice",
        "createdDate": "2024-11-01",
        "tags": ["Finance", "Reports"]
    },
    {
        "id": "2",
        "name": "Team meeting",
        "description": "Schedule and prepare for the team meeting next week.",
        "dueDate": "2024-11-25",
        "priority": "Medium",
        "status": "Not Started",
        "assignedTo": "Bob",
        "createdDate": "2024-11-10",
        "tags": ["Meetings", "Team"]
    },
    {
        "id": "3",
        "name": "Update website",
        "description": "Revise the homepage layout and content.",
        "dueDate": "2024-12-05",
        "priority": "High",
        "status": "Not Started",
        "assignedTo": "Carol",
        "createdDate": "2024-11-15",
        "tags": ["Web Development"]
    },
    {
        "id": "4",
        "name": "Client follow-up",
        "description": "Reach out to clients for feedback on recent services.",
        "dueDate": "2024-11-22",
        "priority": "Medium",
        "status": "Done",
        "assignedTo": "David",
        "createdDate": "2024-11-05",
        "tags": ["Client Relations"]
    },
    {
        "id": "5",
        "name": "Research competitors",
        "description": "Analyze competitors' strategies and performance.",
        "dueDate": "2024-12-10",
        "priority": "Low",
        "status": "In Progress",
        "assignedTo": "Alice",
        "createdDate": "2024-11-12",
        "tags": ["Research", "Strategy"]
    },
    {
        "id": "6",
        "name": "Prepare presentation",
        "description": "Create slides for the upcoming conference presentation.",
        "dueDate": "2024-11-28",
        "priority": "High",
        "status": "Not Started",
        "assignedTo": "Bob",
        "createdDate": "2024-11-14",
        "tags": ["Presentations"]
    },
    {
        "id": "7",
        "name": "Code review",
        "description": "Review code submitted by the development team.",
        "dueDate": "2024-12-01",
        "priority": "Medium",
        "status": "In Progress",
        "assignedTo": "Carol",
        "createdDate": "2024-11-20",
        "tags": ["Development"]
    },
    {
        "id": "8",
        "name": "Organize files",
        "description": "Sort and archive old project files in the server.",
        "dueDate": "2024-12-15",
        "priority": "Low",
        "status": "Not Started",
        "assignedTo": "David",
        "createdDate": "2024-11-18",
    }
]

export function Filter({}) {

}

const DebouncedInput = ({
                            onChange,
                            debounce = 400,
                            ...props
                        }: {
    debounce: number,
    onChange: (value: string | number) => void,
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
    const [value, setValue] = useState(props.value ?? "")
    const debouncedChange = useCallback(_.debounce(() => {
        onChange(value)
    }, debounce, {
        trailing: true,
        leading: false,
    }), [])
    useEffect(() => {
        debouncedChange(value)
    }, [value]);
    return (
        <input
            {...props}
            onChange={(e) => setValue(e.target.value)}
            value={value}
        />
    )
}

export default function Page() {
    const columnDefs = useMemo(() => [
            {
                accessorKey: "id",
                header: "ID",

            },
            {
                accessorKey: "name",
                header: "Name",

            },
            {
                accessorKey: "description",
                header: "Description",

            },
            {
                accessorKey: "dueDate",
                header: "Due Date",
            },
            {
                accessorKey: "priority",
                header: "Priority",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({table, row, column, cell, getValue, renderValue}) => {
                    const rowValue = renderValue().toLowerCase()
                    return (
                        <span className={clsx(
                            "p-1 px-2 rounded-lg block w-full text-center",
                            {
                                "bg-green-400": rowValue === "done",
                                "bg-yellow-600": rowValue === "in progress",
                                "bg-gray-500": rowValue === "not started",
                            })}>
                            {renderValue()}
                        </span>
                    )
                }
            },
            {
                accessorKey: "assignedTo",
                header:
                    "Assigned To",
            },
            {
                accessorKey: "createdDate",
                header:
                    "Created Date",
            },
            {
                accessorKey: "tags",
                header: "Tags",
                cell: ({table, row, cell, getValue, renderValue}) => {
                    const tagsValue = typeof renderValue() === "string"
                        ? renderValue()
                        : Array.isArray(renderValue())
                            ? renderValue().map((tag: string) => tag.toLowerCase().trim())
                            : renderValue();


                    return (
                        <span>
                            {Array.isArray(tagsValue)
                                ? tagsValue.map((tag: string, index: number) => (
                                    <span key={cell.id + "-" + index.toString()}>
                                    {
                                        tag === "web development"
                                            ? <CodeIcon/>
                                            : tag === "development"
                                                ? <SettingsIcon/>
                                                : tag === "client"
                                                    ? <UserIcon/>
                                                    : tag === "reports"
                                                        ? <FileArchiveIcon/>
                                                        : tag

                                    }
                                </span>

                                ))
                                : tagsValue
                            }
                        </span>
                    )
                }

            }
        ],
        []
    )
    const table = useReactTable({
        data: data,
        columns: columnDefs,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableFilters: true,
        renderFallbackValue: <LucideMessageCircleQuestion/>
    })

    return (
        <div className={"flex flex-1 justify-center w-screen h-screen items-center"}>
            <table className={"border-collapse [&_td]:px-4 [&_td]:py-2 [&_th]:py-2 [&_th]:px-4 overflow-x-scroll"}>
                <caption>Task Management Table</caption>
                <thead>
                {
                    table.getHeaderGroups().map((hg) => (
                        <tr className={"bg-gray-500 rounded-lg border-2"} key={hg.id}>
                            {hg.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))
                }
                </thead>

                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (

                            <td key={cell.id} className={clsx({
                                // "whitespace-nowrap": cell.column.id.toLowerCase() !== "description",
                            })}>
                                {
                                    flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext())
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}