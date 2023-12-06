<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231206164032 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notifications ADD value NUMERIC(5, 2) DEFAULT NULL, DROP ask_memory_value, DROP ask_cpu_value');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notifications ADD ask_cpu_value NUMERIC(5, 2) DEFAULT NULL, CHANGE value ask_memory_value NUMERIC(5, 2) DEFAULT NULL');
    }
}
