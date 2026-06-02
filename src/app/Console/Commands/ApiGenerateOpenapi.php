<?php

namespace App\Console\Commands;

use Dedoc\Scramble\Scramble;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

class ApiGenerateOpenapi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:generate-openapi {--path=public/openapi.json : The path where the OpenAPI spec will be saved}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate OpenAPI specification from Laravel routes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating OpenAPI specification...');

        try {
            // Generate the OpenAPI spec using Scramble
            $spec = Scramble::generateOpenApiSpec();

            // Get the output path
            $path = $this->option('path');

            // Ensure the directory exists
            $directory = dirname($path);
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Write the spec to file
            file_put_contents(
                base_path($path),
                json_encode($spec, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
            );

            $this->info("✓ OpenAPI specification generated successfully at: {$path}");
            $this->info("✓ You can now run 'npm run api:generate' to generate TypeScript SDK");

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to generate OpenAPI specification: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
