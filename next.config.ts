import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Sans cette ligne, Turbopack remonte l'arborescence à la recherche d'un lockfile
   * et tombe sur un package-lock.json égaré dans le dossier utilisateur, hors du
   * dépôt. On lui indique explicitement que la racine du projet est ce dossier.
   */
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
