import { GetStaticProps } from 'next'
import React, { Children, useState } from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

function post({ post }: Props) {
    console.log(post)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('succes create comment')
        setSubmitted(true);
        
      })
      .catch((err) => {
        console.log('error :: ', err)
        setSubmitted(false);
    })
  }
  return (
    <div className="m-auto max-w-4xl">
      <Header />
      <main>
        <img src={urlFor(post.mainImage).url()!} alt={post.title + 'image'} />
        <article className="p-5">
          <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
          <h2 className="mb-2 text-xl font-light text-gray-500">
            {post.description}
          </h2>
          <div className="flex items-center space-x-2">
            <img
              src={urlFor(post.author.image).url()!}
              className="h-10 w-10 rounded-full object-cover"
              alt="profile photo"
            />
            <p className="text-sm font-extralight">
              Blog post by{' '}
              <span className="text-green-600">{post.author.name}</span>{' '}
              Published at {new Date(post._createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              content={post.body}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              serializers={{
                h1: (props: any) => (
                  <h1 className="my-5 text-2xl font-bold" {...props} />
                ),
                h2: (props: any) => (
                  <h1 className="my-5 text-xl font-bold" {...props} />
                ),
                li: ({ Children }: any) => (
                  <li className="ml-4 list-disc">{Children}</li>
                ),
                link: ({ href, Children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {Children}
                  </a>
                ),
              }}
            ></PortableText>
          </div>
        </article>
        <hr className="my-5 mx-auto max-w-lg border border-blue-500" />
        {
            submitted?(
                <div className='flex flex-col p-10 items-center bg-blue-500 text-white max-2-2xl mx-auto mb-4'>
                    <h3 className='text-3xl font-bold'>Thank you for submitting your comment!</h3>
                    <p>Once it has been approved, it will appear below!</p>
                </div>
            ):
            <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col"
        >
          <h3 className="text-sm text-blue-500">Enjoyed this article!</h3>
          <h3 className="text-3xl font-bold">Leave a comment below!</h3>
          <hr className="mt-2 py-3" />
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700 ">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3  shadow outline-none ring-blue-500 focus:ring"
              type="text"
              placeholder="Azzouz"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3  shadow outline-none ring-blue-500 focus:ring"
              type="text"
              placeholder="azzouzamine02@gmail.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textare mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-500 focus:ring"
              placeholder="Azzouz"
              rows={8}
            />
          </label>
          <div>
            {errors.name && (
              <span className="text-red-500">The Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">The Email Field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                The Comment Field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded border bg-blue-500 px-4 py-2 text-white
            shadow
             hover:bg-blue-400 focus:outline-none"
          />
        </form>
        }
        <div className='max-w-2xl flex flex-col my-12  mx-auto shadow-blue-500 shadow space-y-2 p-5'>
        <h3 className='text-4xl'>Comments</h3>
        <hr className='pb-2'/>
        {
          post.comments.map((comment)=>(
            <div key={comment._id}>
              <p>
                <span className='text-blue-500'>
                  {comment.name}: 
                </span>
                {comment.comment}
              </p>
            </div>
          ))
        }
        </div>

        
      </main>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `
    *[_type=="post"]{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type=="post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author->{
        name,image
    },
    'comments':*[
        _type=="comment" && 
        post._ref == ^._id &&
        approved == true
    ],
    description,
    mainImage,
    slug,
    body
    
}`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}

export default post
