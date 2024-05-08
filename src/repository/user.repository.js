import  UserDTO  from "../dto/user.dto.js"

class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    
    getUsers = async () => await this.dao.get()
    getUser = async (filter) => await this.dao.getBy(filter)
    createUser = async (newUser) => {
        const newUserDto = new UserDTO(newUser)
        return await this.dao.create(newUserDto)
    }
    updateUser = async (uid, userToUpdate) => await this.dao.update(uid, userToUpdate)
    toggleUserRole = async(uid, newRole) => await this.dao.updateRole(uid, newRole)
    updateUserPassword = async(uid, newPassword) => await this.dao.updatePassword(uid, newPassword)
    deleteUser = async (uid) => await this.dao.delete(uid)
    findInactiveUsers = async(dateThreshold) => await this.dao.findInactive(dateThreshold)
}

export default UserRepository;
