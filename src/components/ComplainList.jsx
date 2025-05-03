
import React from 'react'
import complains from '../../complains.json'
import ComplainCard from './ComplainCard'


const ComplainList = () => {
    return (
        <div>
          <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
              <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                Complain List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {complains.map((complain) => (
                    <ComplainCard key={complain.id} violation={complain} />
                ))}
              </div>
            </div>
          </section>
        </div>
      )
}

export default ComplainList