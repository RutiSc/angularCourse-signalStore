import {Routes} from "@angular/router";
import {courseLessonsResolver} from "./course/course-lessons-resolver";
import {CourseComponent} from "./course/course.component";
import {courseResolver} from "./course/course.resolver";
import {isUserAuthenticated} from "./guards/auth.guards";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {LessonsComponent} from "./lessons/lessons.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [isUserAuthenticated],
    },
    {
        path: "courses/:courseId",
        component: CourseComponent,
        canActivate: [isUserAuthenticated],
        resolve: {
            course: courseResolver,
            lessons: courseLessonsResolver
        }
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "lessons",
        // component: LessonsComponent,
        loadComponent: () =>
            import('./lessons/lessons.component')
                .then(m => m.LessonsComponent)
    },
    {
        path: "**",
        redirectTo: "/",
    },
];
