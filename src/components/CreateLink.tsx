import React, { useState } from "react";
import { generateSlug } from "random-word-slugs";
import { debounce } from "debounce";
import copy from "copy-to-clipboard";

import { trpc } from "../utils/trpc";

type Form = {
  slug: string;
  url: string;
};

const CreateLink = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = location.origin;

  const checkSlug = trpc.useQuery(["checkSlug", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createShortLink = trpc.useMutation(["createShortLink"]);

  if (createShortLink.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center mx-3">
        <span className="pb-3 text-lg font-semibold">Here's your link!</span>

        <div className="flex items-center gap-2">
          <h1 className="text-lg text-center md:text-2xl">{`${url}/${form.slug}`}</h1>
          <button
            className="px-4 py-1.5 ml-3 font-medium transition-colors duration-300 bg-indigo-500 border-2 border-indigo-500 rounded hover:bg-transparent"
            onClick={() => {
              copy(`${url}/${form.slug}`);
            }}
          >
            Copy
          </button>
        </div>

        <button
          className="px-4 mt-8 py-1.5 ml-3 font-medium transition-colors duration-300 bg-indigo-500 border-2 border-indigo-500 rounded hover:bg-transparent"
          onClick={() => {
            createShortLink.reset();
            setForm({ slug: "", url: "" });
          }}
        >
          Create New
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createShortLink.mutate({ ...form });
      }}
    >
      {checkSlug.data?.used ? (
        <span className="font-medium text-center text-red-500">
          This link has already been used
        </span>
      ) : (
        <span className="font-medium text-center">
          {url}/{form.slug}
        </span>
      )}

      <div className="my-2" />

      <div className="flex items-center">
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              slug: e.target.value,
            });

            debounce(checkSlug.refetch, 100);
          }}
          minLength={1}
          maxLength={50}
          placeholder="cat-in-hat"
          className={`w-full px-4 py-2 rounded-md focus:outline-none border-2 placeholder:text-gray-400 ${
            checkSlug.data?.used
              ? "border-red-500 border-opacity-75"
              : "border-gray-200"
          } font-normal bg-black`}
          value={form.slug}
          pattern={"^[-a-zA-Z0-9]+$"}
          title="Only alphanumeric characters and hyphens are allowed. No spaces."
          required
        />
        <input
          type="button"
          value="Random"
          className="px-4 py-2 ml-2 font-medium transition-colors duration-300 bg-indigo-500 border-2 border-indigo-500 rounded cursor-pointer hover:bg-transparent"
          onClick={() => {
            const slug = generateSlug();

            setForm({
              ...form,
              slug,
            });

            checkSlug.refetch();
          }}
        />
      </div>
      <div className="flex flex-col items-center my-2">
        <span className="self-start my-2 font-medium">Link</span>
        <input
          type="url"
          value={form.url}
          maxLength={3000}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://google.com"
          className="block w-full px-4 py-2 font-normal bg-black border-2 border-gray-200 rounded-md focus:outline-none placeholder:text-gray-400"
          required
        />
      </div>
      <input
        type="submit"
        value="Create"
        className={`px-4 py-2 my-2 font-medium transition-colors duration-300 bg-indigo-500 border-2 border-indigo-500 rounded cursor-pointer hover:bg-transparent ${
          createShortLink.status === "loading" ? "opacity-50" : ""
        }`}
        disabled={checkSlug.isFetched && checkSlug.data!.used}
      />
    </form>
  );
};

export default CreateLink;
