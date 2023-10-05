<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231005175301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE containers (id INT AUTO_INCREMENT NOT NULL, docker_id VARCHAR(64) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE containers_user (containers_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_DD57064E7F1FBC6E (containers_id), INDEX IDX_DD57064EA76ED395 (user_id), PRIMARY KEY(containers_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE containers_user ADD CONSTRAINT FK_DD57064E7F1FBC6E FOREIGN KEY (containers_id) REFERENCES containers (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE containers_user ADD CONSTRAINT FK_DD57064EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE containers_user DROP FOREIGN KEY FK_DD57064E7F1FBC6E');
        $this->addSql('ALTER TABLE containers_user DROP FOREIGN KEY FK_DD57064EA76ED395');
        $this->addSql('DROP TABLE containers');
        $this->addSql('DROP TABLE containers_user');
    }
}
