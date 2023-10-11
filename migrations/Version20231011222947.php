<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231011222947 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE container_activity (id INT AUTO_INCREMENT NOT NULL, container_id VARCHAR(64) NOT NULL, timestamp DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', description VARCHAR(80) NOT NULL, INDEX IDX_A4874CF3BC21F742 (container_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE container_activity ADD CONSTRAINT FK_A4874CF3BC21F742 FOREIGN KEY (container_id) REFERENCES containers (id)');
        $this->addSql('ALTER TABLE containers ADD domain VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE container_activity DROP FOREIGN KEY FK_A4874CF3BC21F742');
        $this->addSql('DROP TABLE container_activity');
        $this->addSql('ALTER TABLE containers DROP domain');
    }
}
