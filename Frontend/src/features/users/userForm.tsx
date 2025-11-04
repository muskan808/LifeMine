import React, { useEffect } from 'react';
import { Formik, FieldArray, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addUser, fetchUserById, updateUser } from './usersSlice';
import { User } from '../../types/user';
import { toast } from 'react-toastify';

type Role = 'Admin' | 'Editor' | 'Viewer';

// Form values (User without id)
export type FormValues = Omit<User, 'id'>;

const phoneRegex = /^[0-9+\-() ]*$/;

// keep availableSlots as string ISO and validate later
const UserSchema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required('Required'),
  username: Yup.string().min(3).max(20).required('Required'),
  email: Yup.string().email('Invalid').max(100).required('Required'),
  phone: Yup.string().max(20).matches(phoneRegex, 'Invalid phone'),
  website: Yup.string().url('Invalid URL').max(100).nullable(),
  skills: Yup.array().of(Yup.string().min(2).max(10)),
  availableSlots: Yup.array().of(Yup.string()), // simple string-based validation
  isActive: Yup.boolean().oneOf([true], 'Must be active to submit'),
  address: Yup.object().shape({
    street: Yup.string().min(5).max(100).required('Required'),
    city: Yup.string().min(2).max(50).required('Required'),
    zipcode: Yup.string().matches(/^[0-9]{5,10}$/, 'Zipcode must be numeric 5-10 chars').required('Required'),
  }),
  company: Yup.object().shape({ name: Yup.string().min(2).max(100).required('Required') }),
  role: Yup.mixed().oneOf(['Admin', 'Editor', 'Viewer']).required('Required'),
});

interface UserFormProps {
  editMode?: boolean;
}

export default function UserForm({ editMode }: UserFormProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id: editingId } = params;
  const { list } = useAppSelector((s) => s.users);

  const editingUser = editingId ? list.find((u) => u.id === editingId) : undefined;

  useEffect(() => {
    if (editingId && !editingUser) {
      dispatch(fetchUserById(editingId as string));
    }
  }, [editingId, editingUser, dispatch]);

  const initialValues: FormValues = editingUser
    ? {
        // editingUser satisfies User shape (minus id)
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone ?? '',
        website: editingUser.website ?? '',
        isActive: !!editingUser.isActive,
        skills: editingUser.skills ?? [],
        availableSlots: editingUser.availableSlots ?? [],
        address: editingUser.address ?? { street: '', city: '', zipcode: '' },
        company: editingUser.company ?? { name: '' },
        role: editingUser.role ?? 'Viewer',
      }
    : {
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        isActive: false,
        skills: [],
        availableSlots: [],
        address: { street: '', city: '', zipcode: '' },
        company: { name: '' },
        role: 'Viewer',
      };

  return (
    <div>
      <h2>{editMode ? 'Edit User' : 'Create User'}</h2>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={UserSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (editMode && editingId) {
              await dispatch(updateUser({ id: editingId, patch: values })).unwrap();
              toast.success('User updated');
              navigate(`/users/${editingId}`);
            } else {
              await dispatch(addUser(values)).unwrap();
              toast.success('User created');
              navigate('/');
            }
          } catch (err) {
            toast.error('Failed to save user');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="form-row">
              <label>Name</label>
              <Field name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Username</label>
              <Field name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Email</label>
              <Field name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Phone</label>
              <Field name="phone" />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Website</label>
              <Field name="website" />
              <ErrorMessage name="website" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Is Active</label>
              <Field type="checkbox" name="isActive" />
              <ErrorMessage name="isActive" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Role</label>
              <Field as="select" name="role">
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>

            <div className="form-row">
              <label>Skills</label>
              <FieldArray name="skills">
                {({ push, remove }) => (
                  <div>
                    {values.skills && values.skills.map((s, i) => (
                      <div key={i}>
                        <Field name={`skills.${i}`} />
                        <button type="button" onClick={() => remove(i)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push('')}>Add Skill</button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="form-row">
              <label>Available Slots (ISO datetime)</label>
              <FieldArray name="availableSlots">
                {({ push, remove }) => (
                  <div>
                    {values.availableSlots && values.availableSlots.map((s, i) => (
                      <div key={i}>
                        <Field name={`availableSlots.${i}`} placeholder="YYYY-MM-DDTHH:MM:SSZ" />
                        <button type="button" onClick={() => remove(i)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push(new Date().toISOString())}>Add Slot</button>
                  </div>
                )}
              </FieldArray>
            </div>

            <h3>Address</h3>
            <div className="form-row">
              <label>Street</label>
              <Field name="address.street" />
              <ErrorMessage name="address.street" component="div" className="error" />
            </div>
            <div className="form-row">
              <label>City</label>
              <Field name="address.city" />
              <ErrorMessage name="address.city" component="div" className="error" />
            </div>
            <div className="form-row">
              <label>Zipcode</label>
              <Field name="address.zipcode" />
              <ErrorMessage name="address.zipcode" component="div" className="error" />
            </div>

            <h3>Company</h3>
            <div className="form-row">
              <label>Name</label>
              <Field name="company.name" />
              <ErrorMessage name="company.name" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>Save</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
