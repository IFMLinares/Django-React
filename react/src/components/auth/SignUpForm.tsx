import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { registerAPI } from "../../endpoints/api";
import { registerSchema } from "../../validators/registerSchema";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import LoaderModal from "../ui/modal/loaderModal";
import SuccessModal from "../ui/modal/successModal";
import ErrorModal from "../ui/modal/errorModal";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const handleRegister = async (data: { [key: string]: any }) => {
    setIsLoading(true);
    try {
      const response = await registerAPI({
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        cedula: data.cedula,
        telefono: data.phone,
        fecha_nacimiento: data.fecha_nacimiento,
      });
      if (response && (response.success || response.message)) {
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          navigate("/signin");
        }, 5000);
      } else {
        let msg = "Ocurrió un error";
        if (response && response.message) msg = response.message;
        if (response && typeof response === "object" && !Array.isArray(response)) {
          // Si el backend devuelve errores por campo
          msg = Object.values(response).flat().join("\n");
        }
        setErrorModal({ open: true, message: msg });
      }
    } catch (err: any) {
      let msg = "Ocurrió un error";
      if (err?.response?.data) {
        if (typeof err.response.data === "string") msg = err.response.data;
        else if (typeof err.response.data === "object") msg = Object.values(err.response.data).flat().join("\n");
      }
      setErrorModal({ open: true, message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
    <SuccessModal
      isOpen={successModal}
      onClose={() => setSuccessModal(false)}
      message="Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tus credenciales."
      buttonText="Ir a iniciar sesión"
      buttonAction={() => {
        setSuccessModal(false);
        navigate("/signin");
      }}
    />
    <ErrorModal
      isOpen={errorModal.open}
      message={errorModal.message}
      onClose={() => setErrorModal({ open: false, message: "" })}
    />
    <LoaderModal isOpen={isLoading} />
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Volver al panel
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo y contraseña para registrarte
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(handleRegister)} >
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Nombre<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      placeholder="Ingresa tu nombre"
                      type="text"
                      // id="fname"
                      // name="fname"
                      // onChange={(e) => setFirstName(e.target.value)}
                      {...register("first_name")}
                      hint={errors.first_name ? errors.first_name.message : ""}
                      error={!!errors.first_name}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Apellido<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      placeholder="Ingresa tu apellido"
                      type="text"
                      // id="lname"
                      // name="lname"
                      // onChange={(e) => setLastName(e.target.value)}
                      {...register("last_name")}
                      hint={errors.last_name ? errors.last_name.message : ""}
                      error={!!errors.last_name}
                    />
                  </div>
                </div>
                {/* Cedula and Phone Number */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Cedula --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Cedula<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      placeholder="Ingresa tu número de cédula"
                      type="text"
                      // id="cedula"
                      // name="cedula"
                      // onChange={(e) => setCedula(e.target.value)}
                      {...register("cedula")}
                      hint={errors.cedula ? errors.cedula.message : ""}
                      error={!!errors.cedula}
                    />
                  </div>
                  {/* <!-- Phone Number --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Número de teléfono<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      placeholder="Ingresa tu número de teléfono"
                      type="text"
                      // id="phone"
                      // name="phone"
                      // onChange={(e) => setPhone(e.target.value)}
                      {...register("phone")}
                      hint={errors.phone ? errors.phone.message : ""}
                      error={!!errors.phone}
                    />
                  </div>
                </div>
                {/* username */}
                <div>
                  <Label>
                    Nombre de usuario<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Ingresa tu nombre de usuario"
                    type="text"
                    // id="username"
                    // name="username"
                    // onChange={(e) => setUsername(e.target.value)}
                    {...register("username")}
                    hint={errors.username ? errors.username.message : ""}
                    error={!!errors.username}
                  />
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Correo electrónico<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Ingresa tu correo electrónico"
                    type="email"
                    // id="email"
                    // name="email"
                    // onChange={(e) => setEmail(e.target.value)}
                    {...register("email")}
                    hint={errors.email ? errors.email.message : ""}
                    error={!!errors.email}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? "text" : "password"}
                      // onChange={(e) => setPassword(e.target.value)}
                      {...register("password")}
                      hint={errors.password ? errors.password.message : ""}
                      error={!!errors.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Confirm Password --> */}
                <div>
                  <Label>
                    Confirmar Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? "text" : "password"}
                      // onChange={(e) => setConfirmPassword(e.target.value)}
                      {...register("confirm_password")}
                      hint={errors.confirm_password ? errors.confirm_password.message : ""}
                      error={!!errors.confirm_password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    Al crear una cuenta aceptas los {" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Términos y Condiciones
                    </span>{" "}
                    y nuestra {" "}
                    <span className="text-gray-800 dark:text-white">
                      Política de Privacidad
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button 
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  type="submit"
                >
                    Registrarse
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya tienes una cuenta? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
