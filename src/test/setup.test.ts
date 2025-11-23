import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Project Setup Verification', () => {
  it('should have Vite configuration file', () => {
    const vitePath = join(process.cwd(), 'vite.config.ts')
    expect(existsSync(vitePath)).toBe(true)
  })

  it('should have TypeScript configuration', () => {
    const tsconfigPath = join(process.cwd(), 'tsconfig.json')
    expect(existsSync(tsconfigPath)).toBe(true)
  })

  it('should have Tailwind configuration with glassmorphism tokens', () => {
    const tailwindPath = join(process.cwd(), 'tailwind.config.ts')
    expect(existsSync(tailwindPath)).toBe(true)

    const config = readFileSync(tailwindPath, 'utf-8')
    expect(config).toContain('glass')
    expect(config).toContain('backdropBlur')
  })

  it('should have path aliases configured in tsconfig', () => {
    const tsconfigPath = join(process.cwd(), 'tsconfig.app.json')
    expect(existsSync(tsconfigPath)).toBe(true)

    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
    // Check for path aliases presence in the file content (JSONC can have comments)
    expect(tsconfigContent).toContain('paths')
    expect(tsconfigContent).toContain('@/*')
    expect(tsconfigContent).toContain('@components/*')
    expect(tsconfigContent).toContain('@lib/*')
  })

  it('should have environment variables file', () => {
    const envPath = join(process.cwd(), '.env.local')
    expect(existsSync(envPath)).toBe(true)

    const envContent = readFileSync(envPath, 'utf-8')
    expect(envContent).toContain('VITE_API_BASE_URL')
    expect(envContent).toContain('VITE_MOCK_MODE')
  })

  it('should have required project directories', () => {
    const directories = [
      'src/components',
      'src/lib',
      'src/hooks',
      'src/stores',
      'src/types',
      'public/mock-data'
    ]

    directories.forEach(dir => {
      const dirPath = join(process.cwd(), dir)
      expect(existsSync(dirPath)).toBe(true)
    })
  })

  it('should have test scripts in package.json', () => {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

    expect(packageJson.scripts.test).toBeDefined()
    expect(packageJson.scripts.lint).toBeDefined()
    expect(packageJson.scripts.build).toBeDefined()
    expect(packageJson.scripts.dev).toBeDefined()
  })

  it('should have core dependencies installed', () => {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

    const requiredDeps = [
      'react',
      'react-dom',
      'zustand',
      'axios',
      'react-router',
      'zod',
      'react-hook-form'
    ]

    requiredDeps.forEach(dep => {
      expect(packageJson.dependencies[dep]).toBeDefined()
    })
  })

  it('should have dev dependencies installed', () => {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

    const requiredDevDeps = [
      'vite',
      'typescript',
      'tailwindcss',
      'vitest',
      '@testing-library/react',
      'msw',
      'eslint'
    ]

    requiredDevDeps.forEach(dep => {
      expect(packageJson.devDependencies[dep]).toBeDefined()
    })
  })
})
