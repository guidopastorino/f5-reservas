fotos de perfil:
  se asignaran fotos 'anonimas' con diferentes colores
  cada usuario tendrá un color diferente asignado

react-query
axios
next-themes
next-auth (?)
mongodb
bcrypt
image external storage (<cloudinary>, imgur, firebase)

cada usuario tendrá un rol:
  - admin
  - user

si en /send-email, el rol de usuario actual es 'admin', entonces puede entrar y enviar mails
si es admin puede enviar correos a todos los usuarios o a uno en especìfico.
opciones:
  - De: (email actual del admin, o si quiere puede optar por enviar un mail desde el mail general si es para todos)
  - Destinario/s: Si se deja en vacìo, es para todos, sino, es para un email en especìfico. (hacer efecto de seleccion de email)
  - Asunto: titulo del correo
  - Contenido: Contenido/Cuerpo del correo