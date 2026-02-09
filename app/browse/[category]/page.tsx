import React from 'react'
import FilteredCourse from './FilteredCourse'

export default function CategoryPage({ params }: { params: { category: string } }) {
  // Access dynamic param from URL
  const { category } = params
 const categoryName = category.replace(/-/g, ' ');
  return (
    <>
      <FilteredCourse category={categoryName} />
    </>
  )
}
