export default function passwordGenerator(numbers, letters, specialChars) {
  const numberChars = "0123456789";
  const letterChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialCharsSet = "!@#$%^&*()_+[]{}|;:,.<>?";

  let password = "";

  for (let i = 0; i < numbers; i++) {
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
  }

  for (let i = 0; i < letters; i++) {
    password += letterChars[Math.floor(Math.random() * letterChars.length)];
  }

  for (let i = 0; i < specialChars; i++) {
    password += specialCharsSet[Math.floor(Math.random() * specialCharsSet.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
}