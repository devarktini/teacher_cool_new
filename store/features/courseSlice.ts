import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface CourseState {
  selectedCourse: any | null
}

const initialState: CourseState = {
  selectedCourse: null,
}

export const courseDataSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseDetails: (state, action: PayloadAction<any>) => {
      state.selectedCourse = action.payload
    },
    clearCourseDetails: (state) => {
      state.selectedCourse = null
    },
  },
})

export const { setCourseDetails, clearCourseDetails } = courseDataSlice.actions
export const selectCourseDetails = (state: RootState) => state.course.selectedCourse
export default courseDataSlice.reducer
