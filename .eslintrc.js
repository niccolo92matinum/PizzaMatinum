module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'plugin:@next/next/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: [
    'react'
  ],
  rules:{
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'next-line multiline-ternary': 'off',
    'react/jsx-uses-vars': [2],
    'no-trailing-spaces':'off',
    'no-multiple-empty-lines':'off',
    'indent':'off',
    'no-multi-spaces':'off',
    'eol-last':'off',
    'padded-blocks':'off',
    'no-unused-vars':'off',
    'array-callback-return':'off'
  }

}

/* {
   
    
  } */
