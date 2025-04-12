interface userInterface{
    _id: string,
    username: string,
    email: string,
    password: string,
    avatar?: string,
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export default userInterface