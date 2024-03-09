import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/models/User'
import userScript from '@/scripts/UserScript'
import projectUserScript from '@/scripts/ProjectUserScript'
import type { ProjectUser } from '@/models/ProjectUser'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(userScript.init());
  const activeProjectUser = ref(projectUserScript.init());
  function setUser(newUser: User) {
    user.value = newUser;
    if (user.value.projectUsers) {
      findAndSetActiveProjectUser(user.value.projectUsers);
    }
  }
  function setActiveProjectUser(projectUser: ProjectUser) {
    activeProjectUser.value = projectUser;
  }
  function findAndSetActiveProjectUser(projectUsers: ProjectUser[]) {
    const activeProjectUser = projectUsers.find((projectUser) => projectUser.active)
    if (activeProjectUser) {
      setActiveProjectUser(activeProjectUser)
    }
  }
  return { user, setUser, activeProjectUser, setActiveProjectUser }
})
