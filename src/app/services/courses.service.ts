import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {

    http = inject(HttpClient);

    env = environment;

    async loadAllCourses(): Promise<Course[]> {
        const courses$ =
        this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);
        const  response = await firstValueFrom(courses$);
        return response.courses;
    }

    async getCourseById(courseId: string): Promise<Course> {
        const course$ = this.http.get<Course>
        (`${this.env.apiRoot}/courses/${courseId}`);
        return firstValueFrom(course$);
    }

    async createCourse(course: Partial<Course>): Promise<Course> {
        const courses$ =
            this.http.post<Course>(`${this.env.apiRoot}/courses`, course);
        return firstValueFrom(courses$);
    }

    async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
        const courses$ =
            this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes);
        return firstValueFrom(courses$);
    }

    async deleteCourse(courseId: string) {
        const delete$ =
            this.http.delete<Course>(`${this.env.apiRoot}/courses/${courseId}`);
        return firstValueFrom(delete$);
    }

}
