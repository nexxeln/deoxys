import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";

const CreateLink = dynamic(() => import("../components/CreateLink"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deoxys</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen mx-auto text-gray-100 bg-black">
        <div className="md:w-1/2">
          <Suspense>
            <h1 className="text-6xl font-bold text-center uppercase">
              deoxys
            </h1>
            <p className="text-center capitalize pt-1 text-md">a fast link shortener</p>
            <CreateLink />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Home;
