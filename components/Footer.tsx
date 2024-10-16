import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        {/* Info principal */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Sección de horarios */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-bold mb-2">Horarios de Apertura</h3>
            <p>Lunes a Viernes: 10:00 AM - 11:00 PM</p>
            <p>Sábados y Domingos: 9:00 AM - 12:00 AM</p>
          </div>

          {/* Sección de dirección */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-bold mb-2">Dirección</h3>
            <p>123 Calle Fútbol, Fighiera, Santa Fe, Argentina</p>
          </div>

          {/* Redes sociales */}
          <div className="text-center md:text-right">
            <h3 className="text-white text-lg font-bold mb-2">Síguenos</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>
            © {new Date().getFullYear()} TuAppF5. Todos los derechos reservados. 
            <a href="#" className="text-white hover:underline ml-2">Términos y Condiciones</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;