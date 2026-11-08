/* info.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, icone, filAriane } = UV;

  /* Texte des CGV repris de l'ancien site (unevoyante.fr/index.php/Client_controller/cgv). */
  const CGV = `
      <h2>Conditions générales de prestations de services</h2>

      <h3>Article 1 - Champ d'application</h3>
      <p>Les présentes Conditions Générales de Vente s'appliquent, sans restriction ni réserve à tout achat sur internet des services payants de voyance, d'ésotérisme et de développement personnel, notamment sous forme de messagerie instantanée ('les Services') proposés par la Société KALUWEB, Société à Responsabilité Limitée au capital de 1000 Euros, dont le siège social est 19 C RUE DU DADE 33260 LA TESTE-DE-BUCH inscrite au Registre du Commerce et des Sociétés de Bordeaux sous le numéro 50201643900023 ('le Prestataire') aux consommateurs et clients non professionnels ('Les Clients ou le Client') sur son site Internet UNE VOYANTE.FR.</p>
      <p>Les caractéristiques principales des Services, sont présentées sur le site internet UNE VOYANTE.FR. Le Client est tenu d'en prendre connaissance avant toute passation de commande. Le choix et l'achat d'un Service est de la seule responsabilité du Client.</p>
      <p>Les coordonnées du Prestataire sont les suivantes : Société KALUWEB 19 C RUE DU DADE 33260 LA TESTE-DE-BUCH</p>
      <p>Ces conditions s'appliquent à l'exclusion de toutes autres conditions, et notamment celles applicables pour d'autres circuits de commercialisation des Services.</p>
      <p>Ces Conditions Générales de Vente sont accessibles à tout moment sur le site Internet et prévaudront, le cas échéant, sur toute autre version ou tout autre document contradictoire. Sauf preuve contraire, les données enregistrées dans le système informatique du prestataire constituent la preuve de l'ensemble des transactions conclues avec le Client.</p>
      <p>Conformément à la loi Informatique et Libertés du 6 janvier 1978, renforcée et complétée par le RGPD (règlement général sur la protection des données) entré en vigueur le 25 mai 2018, le Client dispose, à tout moment, d'un droit d'accès, de rectification, d'opposition, d'effacement et de portabilité de l'ensemble de ses données personnelles en écrivant, par courrier et en justifiant de son identité,: Société Kaluweb - <a href="mailto:contact@unevoyante.fr">contact@unevoyante.fr</a></p>
      <p>Le Client déclare avoir pris connaissance des présentes Conditions Générales de Ventes et les avoir acceptées en cochant la case prévue à cet effet avant la mise en œuvre de la procédure de commande en ligne ainsi que des conditions générales d'utilisation du site internet UNE VOYANTE.FR. Sauf preuve contraire, les données enregistrées par la Société Kaluweb constituent la preuve de l'ensemble des transactions passées par la Société Kaluweb et le Client via le site Internet UNE VOYANTE.FR.</p>
      <p>La validation de la commande de Services par le Client vaut acceptation sans restriction ni réserve des présentes Conditions Générales de Vente.</p>
      <p>Le Client reconnaît avoir la capacité requise pour contracter et acquérir les Services proposés sur le site internet UNE VOYANTE.FR.</p>
      <p>Ces Conditions Générales de Vente pouvant faire l'objet de modifications ultérieures, la version applicable à l'achat du Client est celle en vigueur sur le site internet à la date de passation de la commande.</p>
      <p>Les Services présentés sur le site Internet UNE VOYANTE.FR sont proposés à la vente pour la France et en langue française.</p>

      <h3>Article 2 - Commandes</h3>
      <p>Le Client sélectionne sur le site les services qu'il désire commander, selon les modalités suivantes : Le Client devra compléter les informations nécessaires à son identification et notamment ses nom, prénom, adresse postale, adresse e-mail en créant « son compte » sur le site internet. Le Client reconnaît que la saisie de ces informations vaut preuve de son identité. Le client indique alors ses coordonnées bancaires et peut alors bénéficier de 10 « crédits » pour la somme de ZERO (0) euro.</p>
      <p>Chaque « crédit » donne droit à une question précise posée par le Client sur le site UNE VOYANTE.FR et à une réponse précise mentionnée sur le site UNE VOYANTE.FR dans les domaines de la voyance et de l’ésotérisme. Une fois les 10 « crédits » utilisés, le site UNE VOYANTE.FR mentionne la fin desdits « crédits » au Client par un message à son attention. S’il souhaite bénéficier d’autres crédits, Le Client peut acheter des crédits à l’unité ou en packs au tarif visé à l’article 3 ci-après. Toute commande signée du consommateur par "double clic" constitue une acceptation irrévocable qui ne peut être remise en cause que dans les limites prévues dans les présentes conditions générales de vente.</p>
      <p>Le "double clic" associé à la procédure d'authentification et de non répudiation et à la protection de l'intégrité des messages constitue une signature électronique. Cette signature électronique a valeur entre les parties au même titre qu'une signature manuscrite.</p>
      <p>Après avoir choisi le nombre de « crédits » et confirmé le contenu de sa Commande, le Client la validera définitivement par le paiement en indiquant ses coordonnées bancaires. En cliquant sur le bouton/Onglet "CONTINUER SUR LE CHAT" pendant le processus de Commande, et après avoir vérifié dans son « panier » le contenu de la Commande et, le cas échéant, de l’avoir modifiée, le Client déclare accepter pleinement et sans réserve l’intégralité des présentes Conditions Générales de Vente.</p>
      <p>La Commande ne sera définitive qu’à compter du paiement du prix correspondant. La Société Kaluweb confirmera systématiquement la Commande de chaque Client, puis son expédition par courrier électronique à l’adresse donnée par le Client.</p>
      <p>Les informations contractuelles sont présentées en langue française et font l'objet d'une confirmation au plus tard au moment de la validation de la commande par le Client. Les commandes étant passées exclusivement sur internet, l'enregistrement d'une commande sur le site du Prestataire est réalisé lorsque le Client accepte les présentes Conditions Générales de Vente en cochant la case prévue à cet effet et valide sa commande. Le Client a la possibilité de vérifier le détail de sa commande, son prix total et de corriger d'éventuelles erreurs avant de confirmer son acceptation (article 1127-2 du Code Civil). Cette validation implique l'acceptation de l'intégralité des présentes Conditions Générales de Vente et constituent une preuve du contrat de vente. Il appartient donc au Client de vérifier l'exactitude de la commande et de signaler immédiatement toute erreur.</p>
      <p>La vente de Services ne sera considérée comme définitive qu'après l'envoi au Client de la confirmation de l'acceptation de la commande par le Prestataire, par courrier électronique et après encaissement par celui-ci de l'intégralité de l’acompte dû. Toute commande passée sur le site internet UNE VOYANTE.FR constitue la formation d'un contrat conclu à distance entre le Client et le Prestataire.</p>
      <p>La Société Kaluweb se réserve le droit d'annuler ou de refuser toute commande d'un Client avec lequel il existerait un litige relatif au paiement d'une commande antérieure. Aux termes de l'article L 215 -1 du Code de la consommation, littéralement reproduit : “Pour les contrats de prestations de services conclus pour une durée déterminée avec une clause de reconduction tacite, le professionnel prestataire de services informe le consommateur par écrit, par lettre nominative ou courrier électronique dédiés, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat qu'il a conclu avec une clause de reconduction tacite. Cette information, délivrée dans des termes clairs et compréhensibles, mentionne, dans un encadré apparent, la date limite de non-reconduction.</p>
      <p>Lorsque cette information ne lui a pas été adressée conformément aux dispositions du premier alinéa, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la date de reconduction.</p>
      <p>Les avances effectuées après la dernière date de reconduction ou, s'agissant des contrats à durée indéterminée, après la date de transformation du contrat initial à durée déterminée, sont dans ce cas remboursées dans un délai de trente jours à compter de la date de résiliation, déduction faite des sommes correspondant, jusqu'à celle-ci, à l'exécution du contrat. Les dispositions du présent article s'appliquent sans préjudice de celles qui soumettent légalement certains contrats à des règles particulières en ce qui concerne l'information du consommateur.”</p>
      <p>L'article L215-2 du exclut l'application de l'art L215-1 du aux exploitants des services d'eau potable et d'assainissement. : “Les dispositions du présent chapitre ne sont pas applicables aux exploitants des services d'eau potable et d'assainissement.” De même, en vertu de l'article L215-3 du Code de la consommation, les dispositions du présent chapitre sont également applicables aux contrats conclus entre des professionnels et des non-professionnels.”</p>
      <p>L'article L241-3 du sanctionne le professionnel qui n'aurait pas procédé aux remboursements dans les conditions prévues à l'article L 215-1 du Code de la consommation. »</p>

      <h3>Article 3 - Tarifs</h3>
      <p>Les Services proposés par le Prestataire sont fournis aux tarifs en vigueur sur le site internet UNE VOYANTE.FR lors de l'enregistrement de la commande par le Prestataire, une fois les DIX « crédits » utilisés par le Client, ce dernier peut acheter des « crédits » à l’unité ou en « packs ». Chaque crédit est facturé en euro au Client et donne à une question précise posée par le Client sur le site UNE VOYANTE.FR et à une réponse précise mentionnée sur le site UNE VOYANTE.FR dans les domaines de la voyance et de l’ésotérisme.</p>
      <p>Le client peut également acheter plusieurs « crédits » selon les tarifs figurant sur le Site UNE VOYANTE.FR, à savoir :</p>
      <ul>
        <li>Un Pack « prévision » contenant 5 crédits pour un montant de 9.99€ ;</li>
        <li>Un Pack « Évidence » contenant 20 crédits pour un montant de 29.99€ ;</li>
        <li>Un Pack « certitude » contenant 35 crédits pour un montant de 49.99€ ;</li>
        <li>Un Pack « Résolution » contenant 80 crédits pour un montant de 99.99€ ;</li>
      </ul>
      <p>Les prix sont exprimés en Euros et TTC</p>
      <p>Les tarifs tiennent compte d'éventuelles réductions qui seraient consenties par le Prestataire dans les conditions précisées sur le site internet UNE VOYANTE.FR. Ces tarifs sont fermes et non révisables pendant leur période de validité, telle qu'indiqué sur le site internet UNE VOYANTE.FR, le Prestataire se réservant le droit, hors cette période de validité, de modifier les prix à tout moment.</p>
      <p>Ils ne comprennent pas les frais de traitement et de gestion, qui sont facturés en supplément, dans les conditions indiquées sur le site internet UNE VOYANTE.FR et calculés préalablement à la passation de la commande. Le paiement demandé au Client correspond au montant total de l'achat, y compris ces frais. Une facture est établie par le Prestataire et remise au Client lors de la fourniture des Services commandés.</p>

      <h3>Article 4 - Conditions de paiement</h3>
      <p>Le prix est payable comptant, en totalité au jour de la passation de la fourniture de services commandés dans les conditions définies à l’article « FOURNITURE DE SERVICES » ci-aprés, par voie de paiement sécurisé, par cartes bancaires (Visa, MasterCard, American Express, autres cartes bleues)</p>
      <p>Il devra communiquer sur un formulaire en ligne les informations relatives à sa Carte bancaire, permettant ainsi le règlement sécurisé de sa commande :</p>
      <ul>
        <li>le nom du titulaire,</li>
        <li>les 16 chiffres de sa Carte,</li>
        <li>la date d’expiration,</li>
        <li>le Code de Cryptogramme Virtuel figurant au dos de la Carte bancaire.</li>
      </ul>
      <p>Les données de paiement sont échangées en mode crypté grâce au protocole ”Dalenys”. Les paiements par chèques bancaires ne sont pas acceptés. Le Prestataire ne sera pas tenu de procéder à la fourniture des Services commandés par le Client si le prix ne lui a pas été préalablement réglé en totalité dans les conditions et ci-dessus indiquées. Les paiements effectués par le Client ne seront considérés comme définitifs qu'après encaissement effectif des sommes dues par le Prestataire.</p>

      <h3>Article 5 - Fourniture des prestations</h3>
      <p>Les Services commandés par le Client, qui comprennent les prestations de voyance seront fournis par écrit selon les modalités suivantes :</p>
      <ul>
        <li>Un « crédit » se présente sous la forme d'une question écrite précise à laquelle il est apporté une réponse écrite précise</li>
        <li>Une messagerie instantanée écrite et un dialogue en ligne écrit dans les domaines de la voyance et de l’ésotérisme ;</li>
      </ul>
      <p>Dans un délai maximum de 24H à compter de la validation définitive de la commande du Client et de son paiement, dans les conditions prévues aux présentes Conditions Générales de Vente complétées par les conditions particulières de vente remises au Client conjointement aux présentes Conditions Générales de Vente, à l'adresse indiquée par le Client lors de sa commande sur le site Internet UNE VOYANTE.FR.</p>
      <p>Le Prestataire s'engage à faire ses meilleurs efforts pour fournir les Services commandés par le Client, dans le cadre d'une obligation de moyen et dans les délais ci-dessus précisés. Si les services commandés n'ont pas été fournis dans un délai de 24H après la date indicative ci-dessus précisée, pour toute autre cause que la force majeure ou le fait du Client, la vente pourra être résolue à la demande écrite du Client dans les conditions prévues aux articles L 216-2 L 216-3 et L241-4 du Code de la consommation. Les sommes versées par le Client lui seront alors restituées au plus tard dans les quatorze jours qui suivent la date de dénonciation du contrat, à l'exclusion de toute indemnisation ou retenue.</p>

      <h3>Article 6 - Droit de rétractation</h3>
      <p>Le Client dispose, conformément à la loi d'un délai de rétractation de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation auprès du Prestataire et annuler sa commande, sans avoir à justifier de motifs ni à payer de pénalité, à fin d'échange ou de remboursement, sauf si l'exécution des prestations a commencé, avec l'accord du Client, avant la fin du délai de rétractation.</p>
      <p>Le droit de rétractation peut être exercé en ligne, à l'aide du formulaire de rétractation ci-joint et également disponible sur le site internet UNE VOYANCE .FR auquel cas un accusé de réception sur un support durable sera immédiatement communiqué au Client par le Prestataire, ou de toute autre déclaration, dénuée d'ambiguïté, exprimant la volonté de se rétracter et notamment par courrier postal adressé à ”Société KALUWEB 19 C RUE DU DADE 33260 LA TESTE-DE-BUCH ou un mail <a href="mailto:contactunevoyante.fr@gmail.com">contactunevoyante.fr@gmail.com</a> mentionnant la commande concernée par cette rétractation. En cas d'exercice du droit de rétractation dans le délai susvisé, seul le prix des Services commandés est remboursé. Le remboursement des sommes effectivement réglées par le Client sera effectué dans un délai de 14 jours à compter de la réception, par le Prestataire, de la notification de la rétractation du Client.</p>
      <p>Toutefois, et compte tenu de la nature des services fournis, les commandes passées par le Client ne bénéficient pas du droit de rétractation s’il a commencé à bénéficier de l’exécution des prestations, conformément à l’article L221-28 du Code de la consommation qui énonce :</p>
      <p>« Le droit de rétractation ne peut être exercé pour les contrats : 1° De fourniture de services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation ;</p>
      <p>2° De fourniture de biens ou de services dont le prix dépend de fluctuations sur le marché financier échappant au contrôle du professionnel et susceptibles de se produire pendant le délai de rétractation ;</p>
      <p>3° De fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés ;</p>
      <p>4° De fourniture de biens susceptibles de se détériorer ou de se périmer rapidement ;</p>
      <p>5° De fourniture de biens qui ont été descellés par le consommateur après la livraison et qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé ;</p>
      <p>6° De fourniture de biens qui, après avoir été livrés et de par leur nature, sont mélangés de manière indissociable avec d'autres articles ;</p>
      <p>7° De fourniture de boissons alcoolisées dont la livraison est différée au-delà de trente jours et dont la valeur convenue à la conclusion du contrat dépend de fluctuations sur le marché échappant au contrôle du professionnel ;</p>
      <p>8° De travaux d'entretien ou de réparation à réaliser en urgence au domicile du consommateur et expressément sollicités par lui, dans la limite des pièces de rechange et travaux strictement nécessaires pour répondre à l'urgence ;</p>
      <p>9° De fourniture d'enregistrements audio ou vidéo ou de logiciels informatiques lorsqu'ils ont été descellés par le consommateur après la livraison ;</p>
      <p>10° De fourniture d'un journal, d'un périodique ou d'un magazine, sauf pour les contrats d'abonnement à ces publications ;</p>
      <p>11° Conclus lors d'une enchère publique ;</p>
      <p>12° De prestations de services d'hébergement, autres que d'hébergement résidentiel, de services de transport de biens, de locations de voitures, de restauration ou d'activités de loisirs qui doivent être fournis à une date ou à une période déterminée ;</p>
      <p>13° De fourniture d'un contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation » Le Client, qui a commencé l’exécution de la prestation bénéficie des prestations immédiatement après sa commande de crédits sur un support matériel dont l'exécution a commencé après son accord préalable exprès, il renonce donc à son droit de rétractation. Le contrat est donc conclu de façon définitive dès la passation de la commande par le Client selon les modalités précisées aux présentes Conditions générales de Vente.</p>

      <h3>Article 7 - Responsabilité du prestataire - Garantie</h3>
      <p>Le Prestataire garantit, conformément aux dispositions légales et sans paiement complémentaire, le Client, contre tout défaut de conformité ou vice caché, provenant d'un défaut de conception ou de réalisation des Services commandés dans les conditions et selon les modalités définies en annexe aux présentes Conditions Générales de Vente.</p>
      <p>Afin de faire valoir ses droits, le Client devra informer le Prestataire, par écrit, de l'existence des vices ou défauts de conformité dans un délai maximum de VINGT QUATRE (24) heures à compter de la fourniture des Services.</p>
      <p>Le Prestataire remboursera ou rectifiera ou fera rectifier (dans la mesure du possible) les services jugés défectueux dans les meilleurs délais et au plus tard dans les DEUX (2) jours suivant la constatation par le Prestataire du défaut ou du vice. Le remboursement s'effectuera par crédit sur le compte bancaire du Client ou par chèque bancaire adressé au Client.</p>
      <p>La garantie du Prestataire est limitée au remboursement des Services effectivement payés par le Client et le Prestataire ne pourra être considéré comme responsable ni défaillant pour tout retard ou inexécution consécutif à la survenance d'un cas de force majeure habituellement reconnu par la jurisprudence française.</p>
      <p>Les Services fournis par l'intermédiaire du site Internet UNE VOYANTE.FR du Prestataire sont conformes à la réglementation en vigueur en France. La responsabilité du Prestataire ne saurait être engagée en cas de non respect de la législation du pays dans lequel les Services sont fournis, qu'il appartient au Client, qui est seul responsable du choix des Services demandés, de vérifier.</p>

      <h3>Article 8 - Informatiques et libertés</h3>
      <p>En application de la loi 78-17 du 6 janvier 1978 modifiée par la loi n°2018-493 du 20 juin 2018, il est rappelé que les données nominatives qui sont demandés au Client sont nécessaires au traitement de sa commande et à l'établissement des factures, notamment. Ces données peuvent être communiquées aux éventuels partenaires du Prestataire chargés de l'exécution, du traitement, de la gestion et du paiement des commandes. Le traitement des informations communiquées par l'intermédiaire du site internet UNE VOYANTE.FR a fait l'objet d'une déclaration auprès de la CNIL. Le Client dispose, conformément aux réglementations nationales et européennes en vigueur, et notamment conformément à la loi n°78-17 du 6 janvier 1978 relative à l’informatique d'un droit d'accès permanent, de modification, de rectification et d'opposition s'agissant des informations le concernant.</p>
      <p>Pour exercer ce droit, l’Utilisateur devra se connecter au Site ou adresser un courrier postal au service clients de La Société KALUWEB 19 C RUE DU DADE 33260 LA TESTE-DE-BUCH ou un e-mail à <a href="mailto:contactunevoyante.fr@gmail.com">contactunevoyante.fr@gmail.com</a>. En tout état de cause, l’Utilisateur veillera à rappeler ses nom, prénom, adresse et, le cas échéant, son numéro d’Acheteur. Le Site recourt à l’usage de cookies. Le cookie est un fichier informatique, stocké sur le disque dur du micro-ordinateur de l’Utilisateur. Il a pour but de signaler une précédente visite de l’Utilisateur sur le Site. Les cookies ne sont utilisés par La Société Kaluweb que dans le but de personnaliser le service proposé à l’Utilisateur. L’Utilisateur conserve la possibilité de refuser les cookies en configurant son navigateur Internet. Il perd alors la possibilité de personnaliser le service qui lui est délivré par la Société Kaluweb via le Site.</p>

      <h3>Article 8.1 - Relances marketing</h3>
      <p>En vous inscrivant sur unevoyante.fr l'utilisateur accepte d'être solicité plusieurs fois par jour par des courriers promotionnels. L'utilisateur accepte de recevoir les offres de nos partenaires ( Cosmospace, Kgcom, Wengo ) Les offres envoyées par email ou sms pour nos partenaires ainsi que pour le site unevoyante.fr sont rédigées de manière fictionnelles. Le contenu des emails à pour but de divertir le client. Le noms des voyants sont des pseudonymes fictifs, ainsi que les visuels des voyants présentés sur le site sont des illustrations générées par intelligence artificielle, à des fins de représentation visuelle. Ils ne constituent pas des photographies réelles des praticiens L'utilisateur reconnait que le contenu des emails envoyés sont une mise en scène de situation susceptible de se produire ou d'intéresser l'utilisateur.</p>
      <p>Les voyants dits « Normaux » (c’est‑à‑dire tous les conseillers ne portant pas la mention « Voyant Star » ou « Voyant Premium ») interviennent sous des pseudonymes collectifs afin d’assurer une disponibilité continue. Plusieurs membres qualifiés de notre équipe peuvent donc, successivement ou simultanément, répondre au Client sous un même nom de scène. Le Client reconnaît qu’il ne communique pas avec une personne unique, mais avec un collectif de conseillers opérant sous un pseudonyme partagé, et l’accepte expressément.</p>

      <h3>Article 8.2 - Réutilisation des informations de tchat à des fins de relance marketing</h3>
      <p>Lors des échanges sur la messagerie instantanée, le Client peut partager des informations personnelles telles que : son prénom, sa date de naissance, le prénom d’une personne de son entourage (par exemple la personne aimée) et/ou tout autre détail qu’il choisit de communiquer. En cochant la case « J’accepte de recevoir des offres personnalisées » lors de son inscription, le Client autorise expressément la Société KALUWEB à :</p>
      <ul>
        <li>Extraire ces informations textuelles (prénom du Client, prénom de la personne concernée, situation évoquée, etc.) depuis l’historique du tchat ;</li>
        <li>Les réutiliser pour envoyer des e‑mails, SMS ou notifications personnalisés (histoires fictionnelles, promotions, rappels de consultation) émanant du site unevoyante.fr ou de ses partenaires nommément listés à l’article 8.1.</li>
      </ul>
      <p>Cette réutilisation repose sur le consentement (article 6 §1 a) RGPD). Le Client peut retirer ce consentement à tout moment et sans frais : via le lien de désinscription présent dans chaque message promotionnel, ou par simple e‑mail à : <a href="mailto:contactunevoyante.fr@gmail.com">contactunevoyante.fr@gmail.com</a></p>

      <h3>Article 9 - Propriété intellectuelle</h3>
      <p>Le contenu du site internet UNE VOYANTE.FR est la propriété du Vendeur et de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.</p>
      <p>En outre, Le Prestataire reste propriétaire de tous les droits de propriété intellectuelle sur les photographies, présentations, études, dessins, modèles, prototypes, etc, réalisés (même à la demande du Client) en vue de la fourniture des Services au Client. Le Client s'interdit donc toute reproduction ou exploitation desdites études, dessins, modèles et prototypes, etc, sans l'autorisation expresse, écrite et préalable du Prestataire qui peut la conditionner à une contrepartie financière.</p>

      <h3>Article 10 - Imprévision</h3>
      <p>Les présentes Conditions Générales de Vente excluent expressément le régime légal de l'imprévision prévu à l'article 1195 du Code civil pour toutes les opérations de Services du Prestataire au Client. Le Prestataire et le Client renoncent donc chacun à se prévaloir des dispositions de l'article 1195 du Code civil et du régime de l'imprévision qui y est prévu, s'engageant à assumer ses obligations même si l'équilibre contractuel se trouve bouleversé par des circonstances qui étaient imprévisibles lors de la conclusion de la vente, quand bien même leur exécution s'avèrerait excessivement onéreuse et à en supporter toutes les conséquences économiques et financières.</p>

      <h3>Article 11 - Exécution forcée en nature</h3>
      <p>Par dérogation aux dispositions de l'article 1221 du Code civil, les Parties conviennent qu'en cas de manquement de l'une ou l'autre des Parties à ses obligations, la Partie victime de la défaillance ne pourra en demander l'exécution forcée du fait de la spécificité des services commandés.</p>

      <h3>Article 13 - Exception d'inexécution</h3>
      <p>Il est rappelé qu'en application de l'article 1219 du Code civil, chaque Partie pourra refuser d'exécuter son obligation, alors même que celle-ci est exigible, si l'autre Partie n'exécute pas la sienne et si cette inexécution est suffisamment grave, c'est-à-dire, susceptible de remettre en cause la poursuite du contrat ou de bouleverser fondamentalement son équilibre économique. La suspension d'exécution prendra effet immédiatement, à réception par la Partie défaillante de la notification de manquement qui lui aura été adressée à cet effet par la Partie victime de la défaillance indiquant l'intention de faire application de l'exception d'inexécution tant que la Partie défaillante n'aura pas remédié au manquement constaté, signifiée par lettre recommandée avec demande d'avis de réception ou sur tout autre support durable écrit permettant de ménager une preuve de l'envoi.</p>
      <p>Cette exception d'inexécution pourra également être utilisée à titre préventif, conformément aux dispositions de l'article 1220 du Code civil, s'il est manifeste que l'une des Parties n'exécutera pas à l'échéance les obligations qui lui incombent et que les conséquences de cette inexécution sont suffisamment graves pour la Partie victime de la défaillance.</p>
      <p>Cette faculté est utilisée aux risques et périls de la Partie qui en prend l'initiative. La suspension d'exécution prendra effet immédiatement, à réception par la Partie présumée défaillante de la notification de l'intention de faire application de l'exception d'inexécution préventive jusqu'à ce que la Partie présumée défaillante exécute l'obligation pour laquelle un manquement à venir est manifeste, signifiée par lettre recommandée avec demande d'avis de réception ou sur tout autre support durable écrit permettant de ménager une preuve de l'envoi. Si l'empêchement était définitif ou perdurait au-delà de TROIS (3) jours les présentes seraient purement et simplement résolues selon les modalités définies à l'article Résolution pour manquement d'une partie à ses obligations.</p>

      <h3>Article 14 - Force majeure</h3>
      <p>Les Parties ne pourront être tenus pour responsables si la non-exécution ou le retard dans l'exécution de l'une quelconque de leurs obligations, telles que décrites dans les présentes découle d'un cas de force majeure, au sens de l'article 1218 du Code civil. Pendant cette suspension, les parties conviennent que les frais engendrés par la situation seront à la charge de la partie empêchée.</p>

      <h3>Article 15 - Résolution du contrat</h3>
      <p><strong>15-1 - Résolution pour force majeure</strong> La résolution de plein droit pour force majeure, ne pourra, nonobstant la clause Résolution pour manquement d'une partie à ses obligations figurant ci-après, avoir lieu que TROIS (3) jours après l'envoila réception d'une mise en demeure notifiée par lettre recommandée avec demande d'avis de réception ou tout acte extrajudiciaire.</p>
      <p>Toutefois, cette mise en demeure devra mentionner l'intention d'appliquer la présente clause.</p>
      <p><strong>15-2 - Résolution pour manquement d'une partie à ses obligations</strong> En cas de non-respect par l'une ou l'autre des parties, notamment le non paiement à l'échéance des services commandés par le Client ou la non fourniture des services visées aux articles 1 et 5 du présent contrat, celui-ci pourra être résolu au gré de la partie lésée. Il est expressément entendu que cette résolution pour manquement d'une partie à ses obligations aura lieu de plein droit, la mise en demeure résultant du seul fait de l'inexécution de l'obligation, sans sommation, ni exécution de formalités.</p>
      <p><strong>15-3 - Dispositions communes aux cas de résolution</strong> Les prestations échangées entre les Parties depuis la conclusion du contrat et jusqu'à sa résiliation ayant trouvé leur utilité au fur et à mesure de l'exécution réciproque de celui-ci, elles ne sonneront pas lieu à restitution pour la période antérieure à la dernière prestation n'ayant pas reçu sa contrepartie. En tout état de cause, la Partie lésée pourra demander en justice l'octroi de dommages et intérêts.</p>

      <h3>Article 16 - Droit applicable - Langue</h3>
      <p>Les présentes Conditions Générales de Vente et les opérations qui en découlent sont régies et soumises au droit français. Les présentes Conditions Générales de Vente sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues étrangères, seul le texte français ferait foi en cas de litige.</p>

      <h3>Article 17 - Litiges</h3>
      <p>TOUS LES LITIGES AUXQUELS LES OPERATIONS D'ACHAT ET DE VENTE CONCLUES EN APPLICATION DES PRESENTES CONDITIONS GENERALES DE VENTE POURRAIENT DONNER LIEU, CONCERNANT TANT LEUR VALIDITE, LEUR INTERPRETATION, LEUR EXECUTION, LEUR RESILIATION, LEURS CONSEQUENCES ET LEURS SUITES ET QUI N'AURAIENT PU ETRE RESOLUES ENTRE LE VENDEUR ET LE CLIENT SERONT SOUMIS AUX TRIBUNAUX COMPETENTS DANS LES CONDITIONS DE DROIT COMMUN.</p>
      <p>Le Client est informé qu'il peut en tout état de cause recourir à une médiation conventionnelle, notamment auprès de la Commission de la médiation de la consommation (C. consom. art. L 612-1) ou auprès des instances de médiation sectorielles existantes, et dont les références figurent sur le site Internet UNE VOYANTE.FR ou à tout mode alternatif de règlement des différends (conciliation, par exemple) en cas de contestation.</p>

      <h3>Article 18 - Information précontractuelle - Acceptation du client</h3>
      <p>Le Client reconnaît avoir eu communication, préalablement à la passation de sa commande et à la conclusion du contrat, d'une manière lisible et compréhensible, des présentes Conditions Générales de Vente et de toutes les informations listées à l'article L. 221-5 du Code de la consommation, et notamment les informations suivantes :</p>
      <ul>
        <li>les caractéristiques essentielles des Services, compte tenu du support de communication utilisé et du Service concerné ;</li>
        <li>le prix des Services et des frais annexes ;</li>
        <li>en l'absence d'exécution immédiate du contrat, la date ou le délai auquel le Prestataire s'engage à fournir les Services commandés ;</li>
        <li>les informations relatives à l'identité du Prestataire, à ses coordonnées postales, téléphoniques et électroniques, et à ses activités, si elles ne ressortent pas du contexte, les informations relatives aux garanties légales et contractuelles et à leurs modalités de mise en oeuvre ;</li>
        <li>les fonctionnalités du contenu numérique et, le cas échéant, à son interopérabilité ;</li>
        <li>la possibilité de recourir à une médiation conventionnelle en cas de litige ;</li>
        <li>les informations relatives au droit de rétractation (existence, conditions, délai, modalités d'exercice de ce droit et formulaire type de rétractation), aux modalités de résiliation et autres conditions contractuelles importantes. les moyens de paiement acceptés.</li>
      </ul>
      <p>Le fait pour une personne physique (ou morale), de commander sur le site Internet UNE VOYANTE.FR emporte adhésion et acceptation pleine et entière des présentes Conditions Générales de Vente et obligation au paiement des Services commandés, ce qui est expressément reconnu par le Client, qui renonce, notamment, à se prévaloir de tout document contradictoire, qui serait inopposable au Prestataire.</p>`;

  /* Chaque sujet reste une destination réelle, jamais un lien mort. */
  const SUJETS = {
    'mentions-legales': ['Légal', 'Mentions légales',
      'Éditeur, hébergeur, directeur de publication et coordonnées de la société exploitant unevoyante.fr.',
      [],
      /* Contenu rédigé : remplace l'aperçu et l'encart « hors périmètre ». */
      `<h2>Gérant du service</h2>
      <p>Le site unevoyante.fr est géré par la société <strong>SARL KALUWEB</strong>.</p>
      <ul>
        <li>Siège social : 19c rue du Dade, 33260 La Teste-de-Buch</li>
        <li>SIREN : 502016439</li>
        <li>N° TVA intracommunautaire : FR 72 801 803 669</li>
        <li>Email du support : <a href="mailto:kedaweb@gmail.com">kedaweb@gmail.com</a></li>
      </ul>
      <h2>Hébergeur</h2>
      <p>Le site unevoyante.fr est actuellement hébergé par <a href="https://dynamixhost.com" rel="noopener">dynamixhost.com</a>.</p>
      <p>Le site dynamixhost.com est édité par la société <strong>DYNAMIX NETWORK</strong>, SARL au capital
        social de 119 000 €, immatriculée au Registre du Commerce et des Sociétés de Marseille sous le
        n° 801 803 669, dont le siège social est situé 338 Route de la Sainte Baume, 13390 Auriol, France.</p>`],
    'cgv': ['Légal', 'Conditions générales de vente',
      'Règles d’achat et d’utilisation des crédits, droit de rétractation et conditions de remboursement.',
      [], CGV],
    'confidentialite': ['Légal', 'Politique de confidentialité',
      'Données collectées, finalités, durées de conservation et exercice de vos droits RGPD.',
      ['Données collectées et finalités', 'Base légale des traitements', 'Durées de conservation', 'Vos droits : accès, rectification, effacement', 'Contact du délégué à la protection des données']],
    'charte': ['Éthique', 'Charte déontologique',
      'Les engagements que chaque praticien signe avant d’être référencé sur la plateforme.',
      ['Interdiction du diagnostic médical et psychologique', 'Interdiction des pronostics de jeux d’argent', 'Absence de pression et de relance commerciale', 'Refus des consultations de mineurs', 'Procédure de signalement et de suspension']],
    'cookies': ['Légal', 'Gestion des cookies',
      'Cookies strictement nécessaires, mesure d’audience facultative et modification de vos choix.',
      ['Cookies nécessaires au fonctionnement', 'Mesure d’audience anonyme, désactivée par défaut', 'Absence de cookies publicitaires', 'Modifier vos préférences à tout moment']],
    'journal': ['Éditorial', 'Journal ésotérique',
      'Articles de fond sur le tarot, l’astrologie, la numérologie et la pratique de la guidance.',
      ['Comprendre les arcanes du Tarot de Marseille', 'Ce que les nœuds lunaires racontent', 'Numérologie : lire ses cycles personnels', 'Reconnaître une pratique éthique']],
    /* Le contenu est le formulaire #affiliation de info.html, branché plus bas. */
    'partenaire': ['Partenariat', 'Programme d’affiliation',
      'Faites connaître unevoyante.fr auprès de votre audience et percevez une commission sur chaque client apporté.',
      []],
  };

  const cle = UV.param('sujet');
  const s = SUJETS[cle] || ['Information', 'Page introuvable',
    'Cette adresse ne correspond à aucune page de la maquette. Voici par où continuer.',
    []];

  document.title = `${s[1]} | unevoyante.fr`;
  el('#categorie').textContent = s[0];
  el('#titre').textContent = s[1];
  el('#chapeau').textContent = s[2];
  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], [s[1]]]);

  if (s[4]) el('#chantier').hidden = true;
  el('#apercu').innerHTML = s[4] || (s[3].length
    ? `<h2>Ce que cette page contiendra</h2><ul>${s[3].map((p) => `<li>${p}</li>`).join('')}</ul>`
    : '');

  if (cle === 'partenaire') affiliation();

  /* --- Formulaire d'affiliation : envoi simulé, comme celui de contact.html -- */
  function affiliation() {
    el('#chantier').hidden = true;
    el('#affiliation').hidden = false;

    const erreur = el('#erreur');
    let fautif = null;

    function oublier() {
      erreur.classList.add('hidden');
      if (!fautif) return;
      fautif.removeAttribute('aria-invalid');
      fautif.removeAttribute('aria-describedby');
      fautif = null;
    }

    function dire(message, champ) {
      erreur.textContent = message;
      erreur.classList.remove('hidden');
      champ.setAttribute('aria-invalid', 'true');
      champ.setAttribute('aria-describedby', 'erreur');
      fautif = champ;
      champ.focus();
    }

    if (UV.Store.compte) el('#email').value = UV.Store.compte.email || '';

    el('#formulaire').addEventListener('submit', (e) => {
      e.preventDefault();
      oublier();

      const skype = el('#skype').value.trim();
      const email = el('#email').value.trim();
      const message = el('#message').value.trim();

      if (!skype) return dire('Indiquez votre pseudo Skype, pour que nous puissions vous joindre.', el('#skype'));
      if (!/^\S+@\S+\.\S+$/.test(email)) return dire('Cette adresse e-mail semble incomplète.', el('#email'));
      if (message.length < 10) return dire('Présentez votre activité en quelques mots.', el('#message'));
      if (!el('#humain').checked) return dire('Cochez « Je ne suis pas un robot ».', el('#humain'));
      if (el('#site-web').value) return; // champ piège rempli : un robot, on ne dit rien

      const bouton = el('#envoyer');
      bouton.disabled = true;
      bouton.innerHTML = `${icone('progress_activity', 'animate-spin text-[20px]')} Envoi en cours…`;

      setTimeout(() => {
        el('#formulaire').classList.add('hidden');
        el('#confirmation-email').textContent = email;
        el('#confirmation').classList.remove('hidden');
        el('#confirmation-titre').focus();
        UV.toast('Demande envoyée (démonstration).', { icone: 'mark_email_read' });
      }, 900);
    });
  }

  el('#parcours').innerHTML = [
    ['index.html', 'home', 'Accueil', 'Le parcours complet depuis la page d’accueil'],
    ['voyants.html', 'person_search', 'Catalogue', 'Les 24 praticiens, filtres et recherche actifs'],
    ['tchat.html', 'forum', 'Tchat', 'Conversation réelle, débit de crédits inclus'],
    ['credits.html', 'monetization_on', 'Crédits', 'Packs, paiement simulé et rechargement'],
  ].map((p) => `
    <a href="${p[0]}" class="flex items-center gap-3 rounded-md border border-line bg-surface p-4 transition-colors hover:bg-ice">
      ${icone(p[1], 'text-[24px] text-royal shrink-0')}
      <span><strong class="block text-label-md text-navy">${p[2]}</strong>
        <span class="text-body-sm text-muted">${p[3]}</span></span>
    </a>`).join('');

  el('#autres').innerHTML = Object.entries(SUJETS)
    .filter(([k]) => k !== cle)
    .map(([k, v]) => `
      <a href="info.html?sujet=${k}" class="flex items-center justify-between gap-2 rounded px-3 py-2.5 text-label-md text-navy transition-colors hover:bg-ice">
        ${v[1]} ${icone('chevron_right', 'text-[18px] text-muted')}
      </a>`).join('');
})();
