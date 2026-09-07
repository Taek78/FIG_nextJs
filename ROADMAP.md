# Roadmap FIG

> Gelée le 07/09/2026. Les nouvelles idées vont dans les issues (label `parking`),
> le plan ne se rouvre qu'à la fin d'un jalon.

## Principes

- **WIP = 1** : un chantier à la fois.
- Chaque jalon se termine **déployé et démontrable** (tsc + tests + vérification e2e).
- La **V1 en ligne est le péage d'entrée de la V2**.

## État actuel

Site marchand server-first fonctionnel : catalogue filtrable, fiche produit avec
sélecteur de quantité, panier persistant (cookie httpOnly) avec steppers, badge
synchronisé, états pending sur toutes les interactions. Couche métier pure testée
(72 tests Vitest), Server Actions validées contre les entrées forgées.

## V1 — la vitrine irréprochable

| # | Jalon | Taille | Statut |
|---|-------|--------|--------|
| 1 | `useOptimistic` sur /panier (quantités et totaux instantanés) | M | 🔄 en cours |
| 2 | Quick wins : ESLint `no-restricted-imports`, `.gitattributes`, CI GitHub Actions (tsc + tests + lint) | XS | ⬜ |
| 3 | Brancher la recherche `?q=` du header (filtre nom/variété) | S | ⬜ |
| 4 | Pages `/actualites/[slug]` | M | ⬜ |
| 5 | Contenu : vraies descriptions produit, triage du footer (mentions légales, contact) | S | ⬜ |
| 6 | **Déploiement Vercel** (avant la passe de style, volontairement) | S | ⬜ |
| 7 | Passe de style globale (unification des classes dupliquées) | M | ⬜ |
| 8 | README complet | M | ⬜ |

## V2 — le produit full-stack

| # | Jalon | Taille |
|---|-------|--------|
| 0 | Historique de recherche (localStorage, 5 items) | S |
| 1 | **PostgreSQL** : schéma produits + articles, ORM, seeds, stratégie de sauvegarde. Critère de succès : site iso-fonctionnel, couche pure inchangée | M |
| 2 | **Auth + comptes clients** (bibliothèque maintenue) : sessions, fusion du panier cookie → base à la connexion, carte de zone à l'inscription (Leaflet/OSM, géocodage adresse.data.gouv.fr, rayon 50 km — visuel indicatif) | L |
| 3 | **Checkout & commandes** : créneaux de livraison avec capacité, éligibilité 50 km validée côté serveur, mode « paiement à la livraison » d'abord | L |
| 4 | **Stripe (mode test)** : checkout session, webhooks, idempotence | M |
| 5 | **Dashboard admin** — le projet dans le projet, construit d'un bloc une fois le site marchand complet : RBAC, inventaire, édition articles, métriques (CA, panier moyen, tickets, carte des demandes hors zone) | XL |
| 6 | Chatbot recettes (nourri par produits, saisonnalité, articles) | M |
| 7 | Passe marketing / style V2 | S |

Tests E2E (Playwright) introduits au jalon 3, sur le parcours ajout → commande.

## Décisions actées

- **Éligibilité** : le compte est ouvert à tous ; c'est la **commande** qui est
  bloquée hors zone (avec « prévenez-moi ») — les demandes hors zone deviennent
  une métrique d'expansion du dashboard.
- **Dashboard** : un seul bloc, après le site marchand entièrement fonctionnel.
  Architecture (route group `/admin` vs application séparée) tranchée à ce
  moment-là.
- **Checkout avant Stripe** : on ne débogue jamais deux inconnues à la fois.
- **Auth et paiement : jamais faits maison** — bibliothèque maintenue et Stripe.
- **README en toute fin de V1**, devant l'application finie.
