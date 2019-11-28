import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import {RESOURCE_TYPES} from '@/utils/constants';

Vue.use(VueRouter)

const routes = [
  // shows list of films
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  // films detail page
  {
    path: '/film/:id',
    name: RESOURCE_TYPES['Film'].singular.toLowerCase(),
    component: Film,
  },
  // people detail page
  {
    path: '/person/:id',
    name: RESOURCE_TYPES['Person'].singular.toLowerCase(),
    component: Person,
  },
  // species detail page
  {
    path: '/species:id',
    name: RESOURCE_TYPES['Species'].singular.toLowerCase(),
    component: Species,
  },
  // starships detail page
  {
    path: '/starship/:id',
    name: RESOURCE_TYPES['Starship'].singular.toLowerCase(),
    component: Starship,
  },
  // vehicles detail page
  {
    path: '/vehicle/:id',
    name: RESOURCE_TYPES['Vehicle'].singular.toLowerCase(),
    component: Vehicle,
  },
  // planets detail page
  {
    path: '/planet/:id',
    name: RESOURCE_TYPES['Planet'].singular.toLowerCase(),
    component: Planet,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
