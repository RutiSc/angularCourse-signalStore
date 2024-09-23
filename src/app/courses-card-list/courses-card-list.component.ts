import {Component, effect, ElementRef, inject, input, output, viewChildren} from "@angular/core";
import {RouterLink} from "@angular/router";
import {openEditCourseDialog} from "../edit-course-dialog/edit-course-dialog.component";
import {MessagesService} from "../messages/messages.service";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import {CoursesStore} from "../store/courses.store";

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {

    store = inject(CoursesStore);
    messageService = inject(MessagesService);

    courses = input.required<Course[]>();

    // courseUpdated = output<Course>();
    // courseDeleted = output<string>();

    dialog = inject(MatDialog);

    courseCard = viewChildren<ElementRef>("courseCard");

    constructor() {
        effect(() => {
            console.log("courseCard", this.courseCard());
        })
    }

    async onEditCourse(course: Course){
        const newCourse = await openEditCourseDialog(
            this.dialog,
            {
                mode : "update",
                title: "Update Existing Course",
                course
            }
        )
        if(!newCourse) {
            return;
        }

        console.log("Course edited", newCourse)
        // this.courseUpdated.emit(newCourse);
    }

    onCourseDeleted(course: Course) {
        try {
            this.store.deleteCourse(course.id);
        }
        catch (err) {
            console.log(err);
            this.messageService.showMessage("Error deleting course.", "error")
        }
        // this.courseDeleted.emit(course.id);
    }


}
