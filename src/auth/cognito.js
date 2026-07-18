import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_KY8C4Vw7l',
  ClientId: '63jfrsb66221c91mtonkkc08ao',
};

const userPool = new CognitoUserPool(poolData);

export function getCurrentUser() {
  return userPool.getCurrentUser();
}

export function getSession() {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err, session) => {
      if (err) return reject(err);
      resolve(session);
    });
  });
}

export function getIdToken() {
  return getSession().then((session) =>
    session ? session.getIdToken().getJwtToken() : null
  );
}

export function getUserGroups() {
  return getSession().then((session) => {
    if (!session) return [];
    const payload = session.getIdToken().decodePayload();
    return payload['cognito:groups'] || [];
  });
}

export function isAdmin() {
  return getUserGroups().then((groups) => groups.includes('admin'));
}

export function getUserInfo() {
  return getSession()
    .then((session) => {
      if (!session) return null;
      const payload = session.getIdToken().decodePayload();
      const fullName = [payload.given_name, payload.family_name]
        .filter(Boolean)
        .join(' ');
      const name =
        fullName ||
        payload.name ||
        payload.preferred_username ||
        payload.email ||
        payload['cognito:username'] ||
        'Account';
      return {
        name,
        email: payload.email,
        groups: payload['cognito:groups'] || [],
      };
    })
    .catch(() => null);
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    user.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => resolve({ type: 'SUCCESS', result }),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes) => {
        resolve({ type: 'NEW_PASSWORD_REQUIRED', user, userAttributes });
      },
    });
  });
}

export function completeNewPassword(cognitoUser, newPassword) {
  return new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err),
    });
  });
}

export function forgotPassword(email) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    user.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
      inputVerificationCode: (data) => resolve(data),
    });
  });
}

export function confirmForgotPassword(email, code, newPassword) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut() {
  const user = getCurrentUser();
  if (user) user.signOut();
}
