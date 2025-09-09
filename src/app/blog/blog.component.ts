import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  postsData = {
    pt: [
      {
        title: 'Transformação Digital: O Futuro dos Negócios Chegou',
        category: 'Estratégia Digital',
        date: '15 Jan 2025',
        readTime: '8 min de leitura',
        excerpt: 'Descubra como a transformação digital está revolucionando empresas e criando vantagens competitivas sustentáveis no mercado atual.',
        tags: ['Digital', 'Estratégia', 'Inovação'],
        content: 'A transformação digital não é mais uma opção, mas uma necessidade crítica para sobreviver e prosperar no mercado competitivo atual. Este processo abrangente vai muito além da simples adoção de tecnologias - representa uma mudança fundamental na forma como as organizações operam, entregam valor aos clientes e se adaptam às demandas do mercado. Em nossa experiência consultiva, observamos que empresas que abraçam verdadeiramente a transformação digital experimentam aumentos médios de 23% na receita e 12% na eficiência operacional.'
      },
      {
        title: 'Cloud Computing: Revolucionando a Infraestrutura Empresarial',
        category: 'Cloud & DevOps',
        date: '12 Jan 2025',
        readTime: '10 min de leitura',
        excerpt: 'Explore as vantagens estratégicas da migração para nuvem e como implementar uma estratégia cloud-first bem-sucedida.',
        tags: ['Cloud', 'AWS', 'Migração'],
        content: 'O cloud computing revolucionou fundamentalmente a forma como as empresas gerenciam recursos de TI, oferecendo flexibilidade, escalabilidade e eficiência de custos sem precedentes. Nossa experiência em mais de 200 migrações cloud revela que organizações bem-preparadas alcançam reduções de até 40% nos custos operacionais de TI.'
      },
      {
        title: 'Cibersegurança: Blindagem Digital para Empresas Modernas',
        category: 'Segurança',
        date: '10 Jan 2025',
        readTime: '12 min de leitura',
        excerpt: 'Proteja seu negócio contra ameaças cibernéticas com estratégias avançadas de segurança e compliance.',
        tags: ['Segurança', 'LGPD', 'Compliance'],
        content: 'Com ataques cibernéticos aumentando 300% nos últimos dois anos, a cibersegurança tornou-se prioridade estratégica número um para organizações de todos os tamanhos. Nossa abordagem de defesa em profundidade implementa múltiplas camadas de proteção.'
      },
      {
        title: 'Inteligência Artificial: Automatizando o Futuro dos Negócios',
        category: 'IA & Automação',
        date: '08 Jan 2025',
        readTime: '9 min de leitura',
        excerpt: 'Descubra como a IA está transformando operações empresariais e criando novas oportunidades de crescimento.',
        tags: ['IA', 'Machine Learning', 'Automação'],
        content: 'A Inteligência Artificial deixou de ser ficção científica para se tornar realidade empresarial, com 85% das organizações já implementando projetos de IA. Nossa experiência mostra ROI médio de 300% em projetos bem executados.'
      }
    ],
    en: [
      {
        title: 'Digital Transformation: The Future of Business Has Arrived',
        category: 'Digital Strategy',
        date: 'Jan 15, 2025',
        readTime: '8 min read',
        excerpt: 'Discover how digital transformation is revolutionizing companies and creating sustainable competitive advantages in today\'s market.',
        tags: ['Digital', 'Strategy', 'Innovation'],
        content: 'Digital transformation is no longer an option, but a critical necessity to survive and thrive in today\'s competitive market. This comprehensive process goes far beyond simple technology adoption - it represents a fundamental change in how organizations operate, deliver value to customers, and adapt to market demands. In our consulting experience, we observe that companies that truly embrace digital transformation experience average increases of 23% in revenue and 12% in operational efficiency.'
      },
      {
        title: 'Cloud Computing: Revolutionizing Enterprise Infrastructure',
        category: 'Cloud & DevOps',
        date: 'Jan 12, 2025',
        readTime: '10 min read',
        excerpt: 'Explore the strategic advantages of cloud migration and how to implement a successful cloud-first strategy.',
        tags: ['Cloud', 'AWS', 'Migration'],
        content: 'Cloud computing has fundamentally revolutionized how companies manage IT resources, offering unprecedented flexibility, scalability, and cost efficiency. Our experience in over 200 cloud migrations reveals that well-prepared organizations achieve reductions of up to 40% in IT operational costs.'
      },
      {
        title: 'Cybersecurity: Digital Shield for Modern Enterprises',
        category: 'Security',
        date: 'Jan 10, 2025',
        readTime: '12 min read',
        excerpt: 'Protect your business against cyber threats with advanced security and compliance strategies.',
        tags: ['Security', 'GDPR', 'Compliance'],
        content: 'With cyber attacks increasing 300% in the last two years, cybersecurity has become the number one strategic priority for organizations of all sizes. Our defense-in-depth approach implements multiple layers of protection to create a robust and resilient security posture.'
      },
      {
        title: 'Artificial Intelligence: Automating the Future of Business',
        category: 'AI & Automation',
        date: 'Jan 08, 2025',
        readTime: '9 min read',
        excerpt: 'Discover how AI is transforming business operations and creating new growth opportunities.',
        tags: ['AI', 'Machine Learning', 'Automation'],
        content: 'Artificial Intelligence has evolved from science fiction to business reality, with 85% of organizations already implementing AI projects. Our experience shows an average ROI of 300% in well-executed projects with typical payback of 12-18 months.'
      }
    ]
  };

  get posts() {
    const currentLang = this.translationService.getCurrentLanguage();
    return this.postsData[currentLang as keyof typeof this.postsData] || this.postsData.pt;
  }



  selectedPost: any = null;

  constructor(public translationService: TranslationService) {}

  openPost(post: any) {
    this.selectedPost = post;
  }

  closePost() {
    this.selectedPost = null;
  }
}
