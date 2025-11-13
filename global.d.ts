// Allow importing plain CSS files in TypeScript components
declare module "*.css";

// Optional — if you ever use CSS Modules (like table_styles.module.css)
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
