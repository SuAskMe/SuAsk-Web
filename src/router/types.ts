import type { Component } from "vue";
import type { RouteMeta } from "vue-router";

export interface AppRouteRecordRaw extends RouteMeta {
    name: string;
    meta?: RouteMeta;
    component?: Component | string;
    components?: Component;
    children?: AppRouteRecordRaw[];
    fullPath?: string;
}