export const catchError = (error: any) => {
    const errors: string[] = [];
    error.errors.map((item: any) => {
        errors.push(item.message);
    });
    return errors;

};
