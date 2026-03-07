# Security

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

If you believe you have found a security issue in AURA_Marketplace content (e.g., an agent or instruction that could be used to exfiltrate sensitive data, bypass security controls, or cause harm), please report it through your company's internal security disclosure process.

Contact the AURA maintainers team privately via [@SWProductivity/aura-maintainers](https://github.vitesco.io/orgs/SWProductivity/teams/aura-maintainers) or follow your company's Responsible Disclosure Policy.

When reporting, please include:

- A description of the issue and its potential impact
- The file(s) affected (agent, instruction, skill, or plugin)
- Steps to reproduce or demonstrate the vulnerability

## Scope

This repository contains GitHub Copilot configuration files (agents, instructions, skills, plugins). Security concerns include:

- Prompt injection vulnerabilities in agent definitions
- Instructions designed to bypass security policies or exfiltrate data
- Skills or plugins that execute unsafe commands or expose sensitive information
