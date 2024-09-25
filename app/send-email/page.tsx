'use client'

import useUser from '@/hooks/useUser';
import axios from 'axios';
import Link from 'next/link';
import React, { FormEvent } from 'react';

type UserRole = 'admin' | 'user';

const page = () => {
  const user = useUser()

  const currentRole: UserRole = user.role || 'user'

  const isAdmin = (role: UserRole): role is 'admin' => {
    return role === 'admin';
  };

  if (!isAdmin(currentRole)) {
    return (
      <div>
        <p>Oops... parece que eres un usuario intentando enviar correos..</p>
        <div><Link href={"/"}>Volver al inicio</Link></div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const from = (e.currentTarget.elements.namedItem('from') as HTMLInputElement).value;
    const destinarios = (e.currentTarget.elements.namedItem('destinarios') as HTMLInputElement).value;
    const asunto = (e.currentTarget.elements.namedItem('asunto') as HTMLInputElement).value;
    const contenido = (e.currentTarget.elements.namedItem('contenido') as HTMLInputElement).value;
  
    console.log({ from, destinarios, asunto, contenido });
  
    try {
      const response = await axios.post("/api/send-email", { from, destinarios, asunto, contenido });
      if (response.status == 200) {
        (e.target as HTMLFormElement).reset();
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className='flex flex-col gap-3 justify-center items-center'>
      <span className='font-bold text-3xl'>Enviar Email</span>
      <p>Envía email a algún usuario en específico o a todos!</p>

      <form onSubmit={handleSubmit} className='w-full max-w-screen-md flex flex-col gap-3 justify-center items-center'>
        <FormInput value={'f5reservasfighiera@gmail.com'} type='text' placeholder='De' name='from' readOnly />
        <FormInput type='text' placeholder='Destinario/s' name='destinarios' />
        <FormInput type='text' placeholder='Asunto' name='asunto' />
        <textarea className='p-3 border border-black w-full' name="contenido"></textarea>

        <button className='p-2 bg-black text-white'>Enviar</button>
      </form>
    </div>
  );
};

export default page;

type FormInputProps = {
  value?: string;
  type: string;
  placeholder: string;
  name: string;
  readOnly?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({ value, type, placeholder, name, readOnly }) => {
  return (
    <input className='p-3 border border-black w-full' value={value} type={type} placeholder={placeholder} name={name} readOnly={readOnly} />
  );
};
