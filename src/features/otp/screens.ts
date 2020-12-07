export enum OTPScreen {
  EnterEmail = "OTPScreen/EnterEmail",
  VerifyEmail = "OTPScreen/VerifyEmail",
}

export type OTPScreenParams = {
  [OTPScreen.EnterEmail]: { sessionId: string };
  [OTPScreen.VerifyEmail]: { sessionId: string };
};
