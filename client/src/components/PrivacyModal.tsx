import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-spotify-dark p-8 rounded-lg shadow-2xl max-w-2xl w-full relative text-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl font-light leading-none"
            aria-label="Fermer"
          >
            &times;
          </button>
          
          <h2 className="text-3xl font-bold text-white mb-6">Règles de Confidentialité</h2>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <p>
              Votre vie privée est importante pour nous. Cette politique de confidentialité explique quelles données personnelles nous collectons et comment nous les utilisons.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">1. Données collectées</h3>
            <p>
              Tempo se connecte à votre compte Spotify pour fonctionner. En utilisant notre service, vous nous autorisez à accéder aux données suivantes via l'API Spotify :
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Informations de profil :</strong> Votre nom d'utilisateur Spotify et votre photo de profil.</li>
              <li><strong>Votre activité d'écoute :</strong> Vos artistes et titres les plus écoutés sur différentes périodes, ainsi que vos morceaux récemment joués.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">2. Utilisation des données</h3>
            <p>
              Les données collectées sont utilisées <strong>uniquement</strong> pour afficher vos statistiques personnelles au sein de l'application Tempo. Nous ne stockons, ne partageons et ne vendons aucune de vos données personnelles à des tiers. Toutes les informations sont récupérées en temps réel depuis l'API de Spotify et ne sont pas conservées sur nos serveurs.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">3. Cookies</h3>
            <p>
              Nous utilisons des cookies de session uniquement pour vous maintenir connecté à l'application. Ces cookies sont essentiels au fonctionnement du service et sont supprimés lorsque vous vous déconnectez.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">4. Sécurité</h3>
            <p>
              La connexion à votre compte Spotify est sécurisée via le protocole OAuth 2.0 fourni par Spotify. Votre mot de passe n'est jamais accessible ni stocké par notre application.
            </p>
            
            <p className="pt-4 border-t border-gray-700 mt-6">
              Pour toute question concernant cette politique, n'hésitez pas à nous contacter.
            </p>
          </div>
          
          <div className="text-right mt-8">
            <button
              onClick={onClose}
              className="bg-spotify-green text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivacyModal; 