import { Component, OnInit } from '@angular/core';

interface Article {
  _id: string;
  titre: string;
  contenu: string;
  image: string;
  datePublication: string;
  publie: boolean;
}

@Component({
  selector: 'app-gestion-des-articles',
  templateUrl: './gestion-des-articles.component.html',
  standalone: false,
  styleUrls: ['./gestion-des-articles.component.css']
})
export class GestionDesArticlesComponent implements OnInit {
  totalArticlesPublies: number = 0;
  totalArticlesNonPublies: number = 0;
  totalArticlesRecents: number = 0;

  formulaireActif: string = 'ajout'; // 'ajout' ou 'liste'
  articles: Article[] = [];
  nouvelArticle: Article = {
    _id: '', // ID temporaire
    titre: '',
    contenu: '',
    image: '',
    datePublication: '',
    publie: false
  };
  imagePreview: string | ArrayBuffer | null = null;
  rechercheTitre: string = ''; // Recherche par titre
  rechercheDate: string = ''; // Recherche par date

  constructor() {}

  ngOnInit(): void {
    this.articles = [
      { _id: '1', titre: 'Article 1', contenu: 'Contenu de l\'article 1', image: '', datePublication: '2025-04-05', publie: true },
      { _id: '2', titre: 'Article 2', contenu: 'Contenu de l\'article 2', image: '', datePublication: '2025-03-20', publie: false },
      { _id: '3', titre: 'Article 3', contenu: 'Contenu de l\'article 3', image: '', datePublication: '2025-04-01', publie: true }
    ];
    this.chargerStatistiquesArticles();
  }

  afficherFormulaire(type: string): void {
    this.formulaireActif = type;
  }

  private enregistrerArticle(publie: boolean): void {
    const date = new Date();
    this.nouvelArticle.datePublication = date.toISOString().split('T')[0];
    this.nouvelArticle.publie = publie;

    this.articles.unshift({ ...this.nouvelArticle, _id: (this.articles.length + 1).toString() }); // Ajout ID temporaire
    this.resetForm();
    this.chargerStatistiquesArticles();
    this.afficherFormulaire('liste');
  }

  soumettreArticle(): void {
    if (!this.nouvelArticle.titre || !this.nouvelArticle.contenu) {
      alert('Veuillez remplir le titre et le contenu de l\'article.');
      return;
    }
    this.enregistrerArticle(true);
  }

  enregistrerBrouillon(): void {
    this.enregistrerArticle(false);
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = reader.result;
        this.nouvelArticle.image = this.imagePreview as string;
      };
      reader.readAsDataURL(file);
    }
  }

  supprimerArticle(article: Article): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articles = this.articles.filter(a => a._id !== article._id); // Suppression par ID
      this.chargerStatistiquesArticles();
    }
  }

  modifierArticle(article: Article): void {
    this.nouvelArticle = { ...article };
    this.formulaireActif = 'ajout';
  }

  publierArticle(article: Article): void {
    article.publie = true;
    article.datePublication = new Date().toISOString().split('T')[0];
    this.chargerStatistiquesArticles();
  }

  getArticlesFiltres(): Article[] {
    return this.articles.filter(a => {
      const matchesTitre = a.titre.toLowerCase().includes(this.rechercheTitre.toLowerCase());
      const matchesDate = this.rechercheDate ? a.datePublication === this.rechercheDate : true;
      return matchesTitre && matchesDate;
    });
  }

  chargerStatistiquesArticles(): void {
    const maintenant = new Date();
    const dateLimiteRecent = new Date(maintenant);
    dateLimiteRecent.setDate(maintenant.getDate() - 30);

    this.totalArticlesPublies = this.articles.filter(a => a.publie).length;
    this.totalArticlesNonPublies = this.articles.filter(a => !a.publie).length;
    this.totalArticlesRecents = this.articles.filter(a =>
      new Date(a.datePublication) >= dateLimiteRecent
    ).length;
  }

  private resetForm(): void {
    this.nouvelArticle = {
      _id: '', // Réinitialisation de l'ID temporaire
      titre: '',
      contenu: '',
      image: '',
      datePublication: '',
      publie: false
    };
    this.imagePreview = null;
  }
}
