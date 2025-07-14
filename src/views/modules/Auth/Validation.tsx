import { RequestProps } from '@/config/InterfacesAndTypes';
import Message from '@/config/Message';

export const LoginRequest = (): RequestProps => ({
  email: (field?: string) => [
    { required: true, message: Message().required.text(field) },
    { type: 'email', message: Message().email(field) },
  ],
  password: (field?: string) => [
    { required: true, message: Message().required.text(field) },
  ],
  confirmPassword: (field?: string) => [
    { required: true, message: Message().required.text(field) },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          'New Password and Confirm Password does not match.',
        );
      },
    }),
  ],
});
