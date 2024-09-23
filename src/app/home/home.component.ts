import {Component, computed, effect, inject, Injector, OnInit, signal, viewChild} from "@angular/core";
import {openEditCourseDialog} from "../edit-course-dialog/edit-course-dialog.component";
import {LoadingService} from "../loading/loading.service";
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {CoursesStore} from "../store/courses.store";

type Counter = {value: number};

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    store = inject(CoursesStore);

    //מיותר אחרי השדרוג ל signal store
    // #courses = signal<Course[]>([]);

    //מיותר אחרי השדרוג ל signal store
    coursesService = inject(CoursesService);

    dialog = inject(MatDialog);


    // צריך לעבור לסטור עם withComputed

    // beginnerCourses = computed(() => {
    //     const courses = this.#courses();
    //     return courses.filter(course =>
    //         course.category === "BEGINNER")
    // });
    //
    // advancedCourses = computed(() => {
    //     const courses = this.#courses();
    //     return courses.filter(course =>
    //         course.category === "ADVANCED")
    // });

    loadingService = inject(LoadingService);
    messageService = inject(MessagesService);

    beginnersList = viewChild<CoursesCardListComponent>("beginnersList");

    constructor() {
        effect(() => {
            console.log(`beginnersList` , this.beginnersList())
        })
        effect(() => {
            console.log(`Beginner courses: `,this.store.beginnerCourses());
            console.log(`Advanced courses: `,this.store.advancedCourses());
        })
        this.loadCourses().then(() => console.log(`All courses loaded:`));
        // this.loadCourses()
        //     .then(() => console.log(`All courses loaded:`, this.#courses()));
    }

    async loadCourses() {
        try {
            await this.store.loadAllCourses();
            // const courses = await this.coursesService.loadAllCourses();
            // this.#courses.set(courses.sort(sortCoursesBySeqNo));
        }
        catch (err){
            this.messageService.showMessage(`Error loading courses!`, "error");
            console.log(err);
        }
    }


    //מיותר אחרי השדרוג ל signal store

    onCourseUpdated(updatedCourse: Course) {
        // const courses = this.#courses();
        // const newCourses = courses.map(course => (
        //     course.id === updatedCourse.id ? updatedCourse : course
        // ))
        // this.#courses.set(newCourses);
    }

    // async onCourseDeleted(courseId: string) {
    //     try {
    //         await this.coursesService.deleteCourse(courseId);
    //         const courses = this.#courses();
    //         const newCourses = courses.filter(course => course.id !== courseId);
    //         this.#courses.set(newCourses);
    //     }
    //     catch (err) {
    //         console.log(err);
    //         this.messageService.showMessage("Error deleting course.", "error")
    //     }
    // }

    async onAddCourse() {
        const newCourse = await openEditCourseDialog(
            this.dialog,
            {
                mode: "create",
                title: "Crate New Course"
            }
        )
        // if(!newCourse) {
        //     return;
        // }
        // const newCourses = [
        //     ...this.#courses(),
        //     newCourse
        // ];
        // this.#courses.set(newCourses);
    }

}
