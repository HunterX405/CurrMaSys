// Interfaces used on the transformArray (function) on the ElectiveSubjComponent
export interface Elective {
    id: number;
    course_code: string;
    title: string;
    track: string;
    elective_title: string;
    elective_syllabus: string;
    fk_subject_id: number;
    
}

export interface TransformedElective {
    id: number;
    course_code: string;
    title: string;
    SM: string;
    BA: string;
    WEB: string;
    SMID: number;
    BAID: number;
    WEBID: number;
    [key: string]: any;
}
