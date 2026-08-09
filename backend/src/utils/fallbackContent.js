// Fallback content — used only if the live Grok call fails (network issue, rate
// limit, missing key). Keeps the demo functional even offline, but real usage
// always tries Grok first.
const FALLBACK_QUESTIONS = {
  dsa: { question: "What is the time complexity of binary search, and why?", aiAnswer: "Binary search repeatedly halves the search space, so after k steps the remaining size is n/2^k. Solving n/2^k = 1 gives k = log2(n), so the time complexity is O(log n)." },
  oops: { question: "What is the difference between method overloading and overriding?", aiAnswer: "Overloading is having multiple methods with the same name but different parameters within the same class, resolved at compile time. Overriding is redefining a parent class's method in a child class with the same signature, resolved at runtime via polymorphism." },
  dbms: { question: "What is the difference between a primary key and a foreign key?", aiAnswer: "A primary key uniquely identifies each row in its own table and cannot be null. A foreign key is a column that references a primary key in another table, used to enforce referential integrity between tables." },
  os: { question: "What is a deadlock, and what are its four necessary conditions?", aiAnswer: "A deadlock is when processes wait indefinitely for resources held by each other. The four necessary conditions are mutual exclusion, hold and wait, no preemption, and circular wait." },
  cn: { question: "What is the difference between TCP and UDP?", aiAnswer: "TCP is connection-oriented, reliable, and ensures ordered delivery via acknowledgments, making it slower. UDP is connectionless and faster but doesn't guarantee delivery or order, used where speed matters more than reliability, like video streaming." },
  aptitude: { question: "A train travels 300 km in 5 hours. What is its speed in m/s?", aiAnswer: "Speed = distance/time = 300 km / 5 hr = 60 km/hr. Converting to m/s: 60 × (1000/3600) = 16.67 m/s." },
  hr: { question: "How would you answer 'Tell me about a time you failed'?", aiAnswer: "Use the STAR method: describe the Situation and Task briefly, focus most of your answer on the Action you took to address the failure, and end with the Result — specifically what you learned and how you applied it afterward." },
  "system-design": { question: "Why do large systems use load balancers?", aiAnswer: "A load balancer distributes incoming traffic across multiple servers, preventing any single server from being overwhelmed. This improves availability (if one server fails, traffic reroutes) and lets the system scale horizontally by adding more servers." },
};

module.exports = { FALLBACK_QUESTIONS };
