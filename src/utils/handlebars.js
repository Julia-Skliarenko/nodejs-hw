import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';

export const getTemplate = async (templateName, data) => {
  const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.html`);
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const compiledTemplate = handlebars.compile(templateSource);
  return compiledTemplate(data);
};
