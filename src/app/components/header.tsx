"use client";

import Logo from "./logo.svg";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/auth";
import { useStorage } from "../contexts/storage";
import { Loader } from "./loader";

const pages = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Simular nova construção',
    path: '/simular'
  },
  {
    name: 'Configurações',
    path: '/configuracoes'
  },
]

export function Header() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  return <header className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <Link
        href="/"
        rel="noopener noreferrer"
        className='navbar-brand logo-link d-flex align-items-center'
      >
        <Logo className="d-inline-block align-text-top" />
        Dashboard de construção
      </Link>
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={e => setShow(!show)}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse justify-content-between ${show && 'show'}`} id="navbarSupportedContent">
        <ul className="navbar-nav">
          {pages.map(x => (
            <li key={x.path} className="nav-item">
              <Link className={`nav-link ${pathname == x.path ? 'active' : ''}`} href={x.path}>{x.name}</Link>
            </li>
          ))}
        </ul>
        <AuthButton />
      </div>
    </div>
  </header>;

}

function AuthButton() {
  const { doAuth, doLogout, isLoadingAuth, isAuthOk } = useAuth();
  const { isGDriveLoadLoading, isGDriveSaveLoading } = useStorage();

  if (isAuthOk)
    return (
      <div className="d-flex justify-content-center mb-lg-0 mb-2">
        {
          isGDriveLoadLoading || isGDriveSaveLoading
            ? (
              <Loader />
            )
            : (
              <>
                <LoadGDriveButton />
                <SaveGDriveButton />
                <button className="btn btn-outline-success btn-sm me-2" type="button" onClick={doLogout}>Sair</button>
              </>
            )
        }
      </div>
    )
  else
    return isLoadingAuth ? <Loader className="text-success" /> : <button className="btn btn-outline-success" type="button" onClick={doAuth}>Entrar</button>;
}

function LoadGDriveButton() {
  const { isGDriveLoadLoading, doGDriveLoad } = useStorage();

  return (
    <button className="btn btn-outline-success btn-sm me-2" type="button" onClick={doGDriveLoad} disabled={isGDriveLoadLoading}>
      Carregar do drive
    </button>
  );
}

function SaveGDriveButton() {
  const { isGDriveSaveLoading, doGDriveSave } = useStorage();

  return (
    <button className="btn btn-outline-success btn-sm me-2" type="button" onClick={doGDriveSave} disabled={isGDriveSaveLoading}>
      Salvar no drive
    </button>
  );
}

