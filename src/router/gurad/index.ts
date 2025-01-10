import { UserStore } from "@/store/modules/user";
import type { Router } from "vue-router";
import { basicRoutes, studentRoutes, teacherRoutes } from "../routes";

export function createGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    let name = to.name?.toString() + 'Root';
    console.log(name);
    const userStore = UserStore();
    for(let i = 0; i< studentRoutes.length; i++) {
        if(name == studentRoutes[i].name && userStore.getRole() != "student") {
            
            next({ name: "Login" });
            return;   
        }
    }
    for(let i = 0; i< teacherRoutes.length; i++) {
        console.log(teacherRoutes[i].name);
        if(name == teacherRoutes[i].name && userStore.getRole() != "teacher") { 
            next({name: "NotFound"});
            return;   
        }
    }
    console.log(to.name, from.name);
    next();
  })
}