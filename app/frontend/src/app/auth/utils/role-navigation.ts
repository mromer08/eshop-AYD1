import { Router } from "@angular/router"

export const navigateByRole = (router: Router, code: number): void => {
    if ([1001, 1002].includes(code)) {
        router.navigateByUrl('/admin');
    } else {
        router.navigateByUrl('/');
    }
}