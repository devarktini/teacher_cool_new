import React, { useState } from 'react'

function SecondaryButton(props: any) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleButtonClick = (index: number) => {
        setActiveIndex(index);
    };

    // Filter out duplicates by `cat_name` (case-insensitive and trimmed)
    const uniqueData = props.data
        ? props.data.filter(
            (item: any, index: number, self: any) =>
                index ===
                self.findIndex(
                    (t: any) =>
                        t.cat_name?.trim().toLowerCase() === item.cat_name?.trim().toLowerCase()
                )
        )
        : [];
    return (
        <>
            <div className="flex flex-wrap gap-4 items-center pt-8 pb-3 max-sm:px-3">
                <button
                    onClick={() => {
                        props.setCatId("");
                        handleButtonClick(0);
                    }}
                    className={`border border-gray-300 px-4 py-2 rounded-md 
              ${activeIndex === 0
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                        }
            `}
                >
                    All Popular
                </button>
                {uniqueData?.map((item: any, index: number) => (
                    item.course_count > 0 && (
                        <button
                            onClick={() => {
                                props.setCatId(item?.id);
                                handleButtonClick(index + 1);
                            }}
                            key={index}
                            className={`border border-gray-300 px-4 py-2 rounded-md 
              ${index + 1 === activeIndex
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700"
                                }
            `}
                        >
                            {item?.cat_name}
                        </button>
                    )

                ))}
            </div>
        </>
    )
}

export default SecondaryButton
