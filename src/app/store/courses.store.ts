import {computed, inject} from "@angular/core";
import {Course} from "../models/course.model";
import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CoursesService} from "../services/courses.service";

type CoursesState = {
    courses: Course[];
    loading: boolean;
    filter: { query: string; order: "asc" | "desc" };
};

const initialState: CoursesState = {
    courses: [],
    loading: false,
    filter: {query: "", order: "asc"},
};

let courses;
export const CoursesStore = signalStore(
    {providedIn: "root"},
    withState(initialState),
    withMethods(
        (store, coursesService = inject(CoursesService)) => ({
            async loadAllCourses() {
                patchState(store, {loading: true});
                const courses = await coursesService.loadAllCourses();
                patchState(store, {courses: courses, loading: false});
            },
            async updateCourse(courseId: string, changes: Partial<Course>) {
                const updatedCourse = await coursesService.saveCourse(courseId, changes);
                patchState(store, (state) => ({
                    courses: state.courses.map(course =>
                        course.id == courseId ? updatedCourse : course),
                }));
                return updatedCourse;
            },
            async addCourse(course: Partial<Course>) {
                const newCourse = await coursesService.createCourse(course);
                patchState(store, (state) => ({
                    courses: [...state.courses, newCourse],
                }));
            },
            async deleteCourse(courseId: string) {
                await coursesService.deleteCourse(courseId);
                patchState(store, (state) => ({
                    courses: state.courses.filter(course => course.id !== courseId),
                }));
            },
        }),
    ),
    withComputed((state) => ({

        beginnerCourses: computed(() =>{
            const courses = state.courses();
            return courses.filter(course => course.category === "BEGINNER")
        }),

        advancedCourses: computed(() => {return state.courses().filter(course => course.category === "ADVANCED")}),
    })),
);
