import os
import glob

directory = "/Users/babaganesh/civicforge/backend/src/main/java/com/civicforge"
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".java"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            if 'columnDefinition = "jsonb"' in content:
                # Add imports
                if 'import org.hibernate.annotations.JdbcTypeCode;' not in content:
                    content = content.replace('import jakarta.persistence.*;\n', 'import jakarta.persistence.*;\nimport org.hibernate.annotations.JdbcTypeCode;\nimport org.hibernate.type.SqlTypes;\n')
                
                # Replace occurrences
                content = content.replace('@Column(columnDefinition = "jsonb")', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(columnDefinition = "jsonb")')
                content = content.replace('@Column(columnDefinition = "jsonb", updatable = false)', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(columnDefinition = "jsonb", updatable = false)')
                content = content.replace('@Column(name = "failure_summary", columnDefinition = "jsonb")', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(name = "failure_summary", columnDefinition = "jsonb")')
                content = content.replace('@Column(name = "similarity_candidates", columnDefinition = "jsonb")', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(name = "similarity_candidates", columnDefinition = "jsonb")')
                content = content.replace('@Column(name = "suggested_organizations", columnDefinition = "jsonb")', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(name = "suggested_organizations", columnDefinition = "jsonb")')
                content = content.replace('@Column(name = "raw_response", columnDefinition = "jsonb")', '@JdbcTypeCode(SqlTypes.JSON)\n    @Column(name = "raw_response", columnDefinition = "jsonb")')

                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Fixed {filepath}")
