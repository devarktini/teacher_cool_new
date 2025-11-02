import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import toast from 'react-hot-toast'

// Define a type for the course object
interface Course {
  id: string
  name: string
  description?: string
  [key: string]: any // optional: allows flexibility for other fields
}

interface CourseState {
  selectedCourse: Course | null
  selectedBatchCourse: Course | null
}

const initialState: CourseState = {
  selectedCourse: null,
  selectedBatchCourse: null,
}

export const courseDataSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseDetails: (state, action: PayloadAction<Course>) => {
      state.selectedCourse = action.payload
    },
    clearCourseDetails: (state) => {
      state.selectedCourse = null
    },
    setCourseBatch: (state, action: PayloadAction<Course>) => {
      if (typeof action.payload === 'object' && action.payload !== null) {
        state.selectedBatchCourse = action.payload
      } else {
        toast.error('Invalid batch course data. Expected an object.')
      }
    },
    clearCourseBatch: (state) => {
      state.selectedBatchCourse = null
    },
  },
})

export const { 
  setCourseDetails, 
  clearCourseDetails, 
  setCourseBatch, 
  clearCourseBatch 
} = courseDataSlice.actions

export const selectCourseDetails = (state: RootState) => state.course.selectedCourse
export const selectBatchCourse = (state: RootState) => state.course.selectedBatchCourse

export default courseDataSlice.reducer




// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

// interface CourseState {
//   selectedCourse: any | null
// }

// const initialState: CourseState = {
//   selectedCourse: null,
// }

// export const courseDataSlice = createSlice({
//   name: 'course',
//   initialState,
//   reducers: {
//     setCourseDetails: (state, action: PayloadAction<any>) => {
//       state.selectedCourse = action.payload
//     },
//     clearCourseDetails: (state) => {
//       state.selectedCourse = null
//     },
//   },
// })

// export const { setCourseDetails, clearCourseDetails } = courseDataSlice.actions
// export const selectCourseDetails = (state: RootState) => state.course.selectedCourse
// export default courseDataSlice.reducer
