class UserUtil {
  static expectedUserToken() {
    return import.meta.env.DEV ? '0' : 'data_Dawg!11';
  }

  static isValidUserToken(userToken) {
    return true;
  }
}

export default UserUtil;
