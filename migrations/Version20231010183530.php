<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231010183530 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE containers_user DROP FOREIGN KEY containers_user_fk');
        $this->addSql('ALTER TABLE containers_user ADD CONSTRAINT FK_DD57064E7F1FBC6E FOREIGN KEY (containers_id) REFERENCES containers (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE containers_user DROP FOREIGN KEY FK_DD57064E7F1FBC6E');
        $this->addSql('ALTER TABLE containers_user ADD CONSTRAINT containers_user_fk FOREIGN KEY (containers_id) REFERENCES containers (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
