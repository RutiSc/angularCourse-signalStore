import {Component, effect, inject, signal} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {saveCourse} from "../../../server/save-course.route";
import {MessagesService} from "../messages/messages.service";
import {Course} from "../models/course.model";
import {CoursesStore} from "../store/courses.store";
import {EditCourseDialogData} from "./edit-course-dialog.data.model";
import {CoursesService} from "../services/courses.service";
import {LoadingIndicatorComponent} from "../loading/loading.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../models/course-category.model";

@Component({
    selector: "edit-course-dialog",
    standalone: true,
    imports: [
        LoadingIndicatorComponent,
        ReactiveFormsModule,
        CourseCategoryComboboxComponent,
    ],
    templateUrl: "./edit-course-dialog.component.html",
    styleUrl: "./edit-course-dialog.component.scss",
})
export class EditCourseDialogComponent {

    store = inject(CoursesStore);

    dialogRef = inject(MatDialogRef);
    data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
    fb = inject(FormBuilder);
    form = this.fb.group({
        title: [""],
        longDescription: [""],
        // category: [''],
        iconUrl: [""],
    });

    ////מיותר אחרי השדרוג ל signal store
    courseService = inject(CoursesService);
    messageService = inject(MessagesService);

    category = signal<CourseCategory>("BEGINNER");

    constructor() {
        this.form.patchValue({
            title: this.data?.course?.title,
            longDescription: this.data?.course?.longDescription,
            // category: this.data?.course?.category,
            iconUrl: this.data?.course?.iconUrl,
        });

        this.category.set(this.data?.course?.category ?? "BEGINNER");
        effect(() => {
            console.log(`Course category bi-directional binding: ${this.category()}`);
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    async onSave() {
        const courseProps = this.form.value as Partial<Course>;
        courseProps.category = this.category();
        if (this.data?.mode === "update") {
            await this.saveCourse(this.data?.course!.id, courseProps);
        }
        else if (this.data?.mode === "create") {
            await this.createCourse(courseProps);
        }
    }

    async createCourse(course: Partial<Course>) {
        try {
            await this.store.addCourse(course);
            // const newCourse = await this.courseService.createCourse(course);
            this.dialogRef.close();
        }
        catch (err) {
            console.log(err);
            this.messageService.showMessage("Error creating the course.", "error");
        }
    }

    async saveCourse(courseId: string, changes: Partial<Course>) {
        try {
            const updatedCourse = await this.store.updateCourse(courseId, changes);
            // const updatedCourse = await this.courseService.saveCourse(courseId, changes);
            this.dialogRef.close(updatedCourse);
        }
        catch (err) {
            console.log(err);
            this.messageService.showMessage("Failed to save the course.", "error");
        }
    }
}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "400px";
    config.data = data;

    const close$ = dialog.open(EditCourseDialogComponent, config)
        .afterClosed();

    return firstValueFrom(close$);
}
